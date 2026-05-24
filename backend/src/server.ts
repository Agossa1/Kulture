import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { configureRoutes } from './routes';
import PostgresDatabase from './infra/database/postgres';
import { errorMiddleware } from './shared/middlewares/error.middlewares';

export const createServer = async (db: PostgresDatabase) => {
    const app = express();

    app.use(express.json());
    app.use(helmet());
    app.use(cookieParser());
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true, // Autorise l'envoi des cookies
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(morgan('dev'));

    // Montage du routeur principal sous le préfixe /api
    app.use('/api', configureRoutes(db));

    app.get('/health', (req: Request, res: Response) => {
        res.json({ status: 'ok', timestamp: new Date() });
    });

    app.use(errorMiddleware);

    return app;
};