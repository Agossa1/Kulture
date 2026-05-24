import { Request, Response, NextFunction } from "express";
import { PreferencesService } from "../services/preferences.service";
import { BadRequestError } from "../../../shared/errors/appErrors";

export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) {}

    /**
     * Gère la récupération des préférences de l'utilisateur connecté.
     */
    public getPreferences = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Le middleware d'auth doit injecter l'utilisateur dans req.user
            const authId = (req as any).user?.id;
            if (!authId) throw new BadRequestError('Utilisateur non authentifié');

            const preferences = await this.preferencesService.getPreferences(authId);

            return res.status(200).json({
                success: true,
                data: preferences
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Gère la mise à jour des préférences de l'utilisateur connecté.
     */
    public updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authId = (req as any).user?.id;
            if (!authId) throw new BadRequestError('Utilisateur non authentifié');

            const updatedPreferences = await this.preferencesService.updatePreferences(authId, req.body);

            return res.status(200).json({
                success: true,
                message: 'Préférences mises à jour avec succès',
                data: updatedPreferences
            });
        } catch (error) {
            next(error);
        }
    }
}
