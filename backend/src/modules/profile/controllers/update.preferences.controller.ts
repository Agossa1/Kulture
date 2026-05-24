import { Request, Response, NextFunction } from 'express';
import { UpdatePreferencesService } from '../services/update.preferences.service';
import { updatePreferencesSchema } from '../validations/update.preferences.validations';

export class UpdatePreferencesController {
    constructor(private readonly updateService: UpdatePreferencesService) {}

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = updatePreferencesSchema.parse(req.body);
            const prefs = await this.updateService.update(req.params.authId as string, validatedData as any);
            return res.status(200).json({
                success: true,
                message: 'Préférences mises à jour',
                data: prefs
            });
        } catch (error) {
            next(error);
        }
    }
}
