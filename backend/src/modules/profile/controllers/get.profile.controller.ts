import { Request, Response, NextFunction } from 'express';
import { GetProfileService } from '../services/get.profile.service';

export class GetProfileController {
    constructor(private readonly getService: GetProfileService) {}

    public getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authId } = req.params;
            const profile = await this.getService.getProfile(authId as string);
            return res.status(200).json({ success: true, data: profile });
        } catch (error) {
            next(error);
        }
    }
}
