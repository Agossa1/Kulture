/**
 * Interface pour standardiser les réponses de succès de l'API.
 * @template T Le type des données renvoyées.
 */
export interface ApiResponse<T = undefined> {
    success: true;
    message?: string;
    data?: T;
}

/**
 * Fonction utilitaire pour créer une réponse de succès standardisée.
 * @template T Le type des données à inclure dans la réponse.
 * @param message Message optionnel décrivant le succès.
 * @param data Données optionnelles à inclure dans la réponse.
 * @returns Une réponse de succès formatée.
 */
export function successResponse<T>(message?: string, data?: T): ApiResponse<T> {
    return {
        success: true,
        ...(message && { message }),
        ...(data !== undefined && { data }),
    };
}
