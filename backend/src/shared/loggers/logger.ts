import winston from 'winston';

// Mock d'import de configuration pour que le fichier fonctionne en autonomie
// Remplace par ton vrai import si nécessaire : import { appConfig } from '../../config/app/appConfig';
const appConfig = {
    app: {
        isProduction: process.env.NODE_ENV === 'production'
    }
};

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

// Dictionnaire des codes d'erreur PostgreSQL les plus courants pour un affichage clair
const PG_ERROR_CODES: Record<string, string> = {
    '23505': 'Violation d\'unicité (Valeur dupliquée sur un champ unique)',
    '23503': 'Violation de clé étrangère (Référence inexistante)',
    '23502': 'Violation de contrainte Not Null (Champ requis manquant)',
    '42601': 'Erreur de syntaxe (Nombre d\'expressions incorrect ou requête malformée)',
    '42703': 'Colonne non définie (La colonne ciblée n\'existe pas dans la table)',
    '42P01': 'Table non définie (La table ciblée n\'existe pas)',
    '40001': 'Échec de sérialisation (Deadlock détecté / Concurrence de requêtes)',
    '23514': 'Violation de contrainte Check (Une contrainte CHECK a échoué)',
    '22P02': 'Représentation texte invalide (Type de donnée invalide, ex: UUID malformé)',
    '42883': 'Fonction non définie (La fonction ciblée n\'existe pas)'
};

// NOUVEAU: Dictionnaire pour traduire à la volée les messages d'erreur textuels (Anglais -> Français)
const EN_TO_FR_DICTIONARY: Record<string, string> = {
    // Erreurs PostgreSQL fréquentes
    'INSERT has more target columns than expressions': 'La requête INSERT comporte plus de colonnes cibles que d\'expressions',
    'INSERT has more expressions than target columns': 'La requête INSERT comporte plus d\'expressions que de colonnes cibles',
    'duplicate key value violates unique constraint': 'La valeur dupliquée viole une contrainte d\'unicité',
    'violates foreign key constraint': 'Viole la contrainte de clé étrangère',
    'violates not-null constraint': 'Viole la contrainte non-nulle (champ requis)',
    
    // Vos erreurs applicatives (si vous les logguez en anglais dans vos catch)
    'Error updating last login:': 'Erreur lors de la mise à jour de la dernière connexion :',
    'Error creating user:': 'Erreur lors de la création de l\'utilisateur :'
};

/**
 * Intercepte et traduit les messages de logs de l'anglais vers le français
 */
function translateLogMessage(msg: any): string {
    if (!msg) return '';
    let translated = String(msg);
    
    for (const [eng, fr] of Object.entries(EN_TO_FR_DICTIONARY)) {
        // Utilisation d'une RegEx pour remplacer l'expression anglaise, peu importe où elle se trouve
        const regex = new RegExp(eng, 'gi');
        translated = translated.replace(regex, fr);
    }
    return translated;
}

/**
 * Analyse la stack trace pour extraire et formater proprement le cheminement
 * logique de l'application (Controller -> Service -> Repository)
 */
function parseAppFlow(stack: string | undefined): string {
    if (!stack) return '';

    const lines = stack.split('\n');
    const appLines: string[] = [];
    const cwd = process.cwd();

    // On ne garde que les lignes de la stack qui appartiennent à notre code source
    for (const line of lines) {
        if (line.includes('at ') && !line.includes('node_modules') && !line.includes('node:internal')) {
            appLines.push(line.trim());
        }
    }

    if (appLines.length === 0) return '';

    let flowStr = `\n  \x1b[33m⚡ CHEMINEMENT LOGIQUE DE L'APPLICATION :\x1b[0m\n`;

    appLines.forEach((line: string, index: number) => {
        // Capture la fonction/méthode et le fichier
        const match = line.match(/at (?:async )?([^(]+)\s*\((.+)\)/) || line.match(/at\s+(.+)/);
        if (match) {
            const method = match[1].trim();
            let filePath = match[2] ? match[2].trim() : match[1].trim();

            // Raccourcit le chemin absolu pour le rendre relatif au projet (plus lisible)
            if (filePath.startsWith(cwd)) {
                filePath = '.' + filePath.substring(cwd.length);
            }

            // Détection automatique de la couche d'architecture concernée
            let layer = '\x1b[36m[App]\x1b[0m       '; // Cyan par défaut
            const lowerMethod = method.toLowerCase();
            const lowerPath = filePath.toLowerCase();

            if (lowerMethod.includes('controller') || lowerPath.includes('controller')) {
                layer = '\x1b[36m[Controller]\x1b[0m'; // Cyan
            } else if (lowerMethod.includes('service') || lowerPath.includes('service')) {
                layer = '\x1b[34m[Service]\x1b[0m   '; // Bleu
            } else if (lowerMethod.includes('repositor') || lowerPath.includes('repositor')) {
                layer = '\x1b[35m[Repository]\x1b[0m'; // Magenta
            } else if (lowerMethod.includes('middleware') || lowerPath.includes('middleware')) {
                layer = '\x1b[32m[Middleware]\x1b[0m'; // Vert
            }

            // La première ligne capturée est la source directe de l'erreur dans notre code
            const isOrigin = index === 0;
            const originIndicator = isOrigin ? '  \x1b[31m🔥 (Origine de l\'erreur)\x1b[0m' : '';
            const connector = index === appLines.length - 1 ? '  └─' : '  ├─';

            flowStr += `${connector} ${layer} \x1b[1m${method}\x1b[0m${originIndicator}\n`;
            flowStr += `     \x1b[90m└─ ${filePath}\x1b[0m\n`;
        }
    });

    return flowStr;
}

/**
 * Extrait le contexte HTTP si des infos de requête (req) sont passées dans les métadonnées
 */
function parseHttpContext(metadata: Record<string, any>): string {
    const req = metadata.req || metadata.request;
    if (!req) return '';

    let httpStr = `\n  \x1b[34m🌐 CONTEXTE DE LA REQUÊTE HTTP :\x1b[0m\n`;
    if (req.method && (req.originalUrl || req.url)) {
        httpStr += `  ├─ \x1b[1mRoute :\x1b[0m          \x1b[32m${req.method} ${req.originalUrl || req.url}\x1b[0m\n`;
    }
    if (req.ip) httpStr += `  ├─ \x1b[1mIP Client :\x1b[0m      ${req.ip}\n`;
    if (req.user?.id || req.user?.sub) httpStr += `  ├─ \x1b[1mID Utilisateur :\x1b[0m \x1b[33m${req.user.id || req.user.sub}\x1b[0m\n`;
    
    if (req.body && Object.keys(req.body).length > 0) {
        const bodyStr = JSON.stringify(req.body);
        const truncatedBody = bodyStr.length > 100 ? bodyStr.substring(0, 100) + '...' : bodyStr;
        httpStr += `  └─ \x1b[1mCharge utile :\x1b[0m   \x1b[90m${truncatedBody}\x1b[0m\n`;
    } else {
        // Ajustement visuel s'il n'y a pas de payload
        httpStr = httpStr.trimEnd();
        const lastIndex = httpStr.lastIndexOf('  ├─');
        if (lastIndex !== -1) {
            httpStr = httpStr.substring(0, lastIndex) + '  └─' + httpStr.substring(lastIndex + 4);
        }
        httpStr += '\n';
    }
    return httpStr;
}

/**
 * Extrait les erreurs de validation (type Zod, Joi, class-validator)
 */
function parseValidationDetails(metadata: Record<string, any>): string {
    const errors = metadata.validationErrors || metadata.issues || (metadata.name === 'ZodError' ? metadata.errors : null);
    if (!errors || !Array.isArray(errors) || errors.length === 0) return '';

    let valStr = `\n  \x1b[33m🛡️  ÉCHEC DE LA VALIDATION :\x1b[0m\n`;
    errors.slice(0, 5).forEach((err: any, idx: number) => {
        const isLast = idx === Math.min(errors.length, 5) - 1;
        const connector = isLast ? '  └─' : '  ├─';
        const path = err.path ? err.path.join('.') : (err.property || 'champ_inconnu');
        const message = err.message || (err.constraints ? Object.values(err.constraints)[0] : 'Valeur invalide');
        valStr += `${connector} \x1b[1m${path} :\x1b[0m \x1b[31m${message}\x1b[0m\n`;
    });

    if (errors.length > 5) {
        valStr += `  \x1b[90m    ... et ${errors.length - 5} autres erreurs\x1b[0m\n`;
    }
    return valStr;
}

/**
 * Extrait et structure visuellement les détails spécifiques aux erreurs de base de données PostgreSQL
 */
function parseDatabaseDetails(metadata: Record<string, any>): string {
    const code = metadata.code as string | undefined;
    if (!code) return '';

    const codeMeaning = PG_ERROR_CODES[code] || 'Code PostgreSQL inconnu';
    
    let dbStr = `\n  \x1b[31m💥 DÉTAILS DU CONTEXTE DE BASE DE DONNÉES :\x1b[0m\n`;
    dbStr += `  ├─ \x1b[1mType d'erreur :\x1b[0m  \x1b[31m${codeMeaning} (${code})\x1b[0m\n`;
    
    if (metadata.table) {
        dbStr += `  ├─ \x1b[1mTable ciblée :\x1b[0m   \x1b[33m${metadata.table}\x1b[0m\n`;
    }
    if (metadata.column) {
        dbStr += `  ├─ \x1b[1mColonne :\x1b[0m        ${metadata.column}\n`;
    }
    if (metadata.constraint) {
        dbStr += `  ├─ \x1b[1mContrainte :\x1b[0m     \x1b[35m${metadata.constraint}\x1b[0m\n`;
    }
    // NOUVEAU: Affichage de la requête et de ses paramètres
    if (metadata.query) {
        const q = metadata.query.length > 150 ? metadata.query.substring(0, 150) + '...' : metadata.query;
        dbStr += `  ├─ \x1b[1mRequête :\x1b[0m        \x1b[36m${q}\x1b[0m\n`;
    }
    if (metadata.parameters) {
        dbStr += `  ├─ \x1b[1mParamètres :\x1b[0m     \x1b[90m${JSON.stringify(metadata.parameters)}\x1b[0m\n`;
    }
    if (metadata.detail) {
        dbStr += `  ├─ \x1b[1mDétails :\x1b[0m        ${metadata.detail}\n`;
    }
    if (metadata.hint) {
        dbStr += `  ├─ \x1b[1mIndice :\x1b[0m         \x1b[32m${metadata.hint}\x1b[0m\n`;
    }
    if (metadata.routine) {
        dbStr += `  └─ \x1b[1mRoutine PG :\x1b[0m     ${metadata.routine} (${metadata.file || 'inconnu'}:${metadata.line || 'inconnu'})\n`;
    } else {
        // Ajustement esthétique de la dernière ligne s'il n'y a pas de routine PG
        dbStr = dbStr.trimEnd();
        const lastIndex = dbStr.lastIndexOf('  ├─');
        if (lastIndex !== -1) {
            dbStr = dbStr.substring(0, lastIndex) + '  └─' + dbStr.substring(lastIndex + 4);
        }
        dbStr += '\n';
    }

    return dbStr;
}

const customConsoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    // Colorisation grise pour le timestamp
    const tsColor = '\x1b[90m';
    const resetColor = '\x1b[0m';
    const formattedTimestamp = `${tsColor}[${timestamp}]${resetColor}`;

    // On vérifie s'il s'agit d'une erreur PostgreSQL
    const isPgError = !!(metadata.code && (metadata.severity || metadata.routine));

    // NOUVEAU : Traduction à la volée du texte principal du message
    const translatedMessage = translateLogMessage(message);

    // Construction du message de base avec le texte traduit
    let msg = `${formattedTimestamp} ${level}: \x1b[1m${translatedMessage}\x1b[0m`;

    // 1. Si on a une stack trace, on génère le parcours applicatif propre
    if (stack && typeof stack === 'string') {
        msg += parseAppFlow(stack);
    }

    // 2. Contexte HTTP (si on a passé `req` dans les logs)
    msg += parseHttpContext(metadata);

    // 3. Erreurs de Validation (Zod, etc.)
    msg += parseValidationDetails(metadata);

    // 4. Si c'est une erreur Postgres, on ajoute le bloc DB dédié
    if (isPgError) {
        msg += parseDatabaseDetails(metadata);
    }

    // 5. Traitement des métadonnées restantes (sans polluer avec les détails déjà traités)
    const cleanMetadata = { ...metadata };
    delete cleanMetadata[Symbol.for('level')];
    delete cleanMetadata[Symbol.for('splat')];
    delete cleanMetadata[Symbol.for('message')];
    delete cleanMetadata.req; // Nettoyage HTTP
    delete cleanMetadata.request;
    delete cleanMetadata.issues; // Nettoyage Zod
    delete cleanMetadata.validationErrors;
    delete cleanMetadata.errors;

    if (isPgError) {
        const pgKeys = ['severity', 'code', 'detail', 'hint', 'table', 'column', 'constraint', 'file', 'line', 'routine', 'length', 'name', 'position', 'query', 'parameters'];
        pgKeys.forEach(key => delete cleanMetadata[key]);
    }

    if (Object.keys(cleanMetadata).length > 0) {
        msg += `\n  \x1b[36m📋 Métadonnées supplémentaires :\x1b[0m\n  ${JSON.stringify(cleanMetadata, null, 2).split('\n').join('\n  ')}`;
    }

    // 4. Ajout de la stack trace brute à la fin au besoin (commentée ou décalée pour ne pas gêner)
    if (stack && typeof stack === 'string') {
        msg += `\n  \x1b[90m📋 Trace d'exécution (Stack Trace) brute :\x1b[0m\n  ` + stack.split('\n').slice(0, 4).map((line: string) => `    \x1b[90m${line}\x1b[0m`).join('\n  ') + '\n  \x1b[90m    ...\x1b[0m';
    }

    return msg;
});

export const logger = winston.createLogger({
    level: appConfig.app.isProduction ? 'info' : 'debug',
    format: combine(
        errors({ stack: true }), 
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        json() // Garde le JSON pur pour la prod (fichiers de logs indexables par Datadog, ELK, etc.)
    ),

    transports: [
        // Fichier d'erreurs en production
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            silent: !appConfig.app.isProduction
        }),

        // Fichier combiné en production
        new winston.transports.File({
            filename: 'logs/combined.log',
            silent: !appConfig.app.isProduction
        }),

        // Transport Console hautement lisible en développement
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                customConsoleFormat
            ),
            silent: false
        })
    ]
});

// Bloc de test d'affichage en mode développement direct
if (require.main === module) {
    logger.info('🚀 Logger initialisé et prêt pour le diagnostic visuel !');

    // Simulation d'un contexte de requête HTTP
    const mockReq = {
        method: 'POST',
        originalUrl: '/api/v1/auth/login',
        ip: '192.168.1.42',
        user: { id: 'usr_12345' },
        body: { email: "test@example.com", password: "***" }
    };

    // Simulation de l'erreur exacte que vous avez rencontrée
    const mockPgError = new Error('INSERT has more target columns than expressions');
    Object.assign(mockPgError, {
        length: 116,
        name: "error",
        severity: "ERROR",
        code: "42601",
        position: "123",
        file: "analyze.c",
        line: "979",
        routine: "transformInsertRow",
        table: "user_activity",
        query: "INSERT INTO user_activity (user_id, last_login_at, ip_address) VALUES ($1, $2)",
        parameters: ["usr_12345", "2026-05-23T10:35:33.163Z"],
        stack: "error: INSERT has more target columns than expressions\n    at /Volumes/Dev/app/node_modules/pg/lib/client.js:631:17\n    at async UserActivityRepository.updateLastLogin (/Volumes/Dev/app/src/modules/users/repositories/user_activity.repositories.ts:42:13)\n    at async AuthService.login (/Volumes/Dev/app/src/modules/auth/services/auth.service.ts:88:29)\n    at async AuthController.login (/Volumes/Dev/app/src/modules/auth/controllers/auth.controller.ts:35:29)"
    });

    // Envoi du log reproduisant votre situation : le texte combiné sera intercepté et traduit !
    logger.error(`Error updating last login: ${mockPgError.message}`, { ...mockPgError, req: mockReq });
}