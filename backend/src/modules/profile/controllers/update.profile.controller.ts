import { Request, Response, NextFunction } from 'express';
import { UpdateProfileService } from '../services/update.profile.service';
import { updateProfileSchema } from '../validations/update.profile.validations';

export class UpdateProfileController {
    constructor(private readonly updateService: UpdateProfileService) {}

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = updateProfileSchema.parse(req.body);
            const updated = await this.updateService.update(req.params.authId as string, validatedData);
            return res.status(200).json({
                success: true,
                message: 'Profil mis à jour avec succès',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    }
}
