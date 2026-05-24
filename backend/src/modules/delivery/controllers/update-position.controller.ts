import { Request, Response, NextFunction } from 'express';
import { UpdatePositionService } from '../services/update-position.service';
import { updatePositionSchema } from '../validations/update-position.validations';

export class UpdatePositionController {
    constructor(private readonly updateService: UpdatePositionService) {}

    public updatePosition = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = updatePositionSchema.parse(req.body);
            await this.updateService.updatePosition(validatedData);
            
            return res.status(200).json({
                success: true,
                message: 'Position mise à jour'
            });
        } catch (error) {
            next(error);
        }
    }
}
