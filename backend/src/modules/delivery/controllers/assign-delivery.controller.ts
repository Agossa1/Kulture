import { Request, Response, NextFunction } from 'express';
import { AssignDeliveryService } from '../services/assign-delivery.service';
import { assignDeliverySchema } from '../validations/assign-delivery.validations';

export class AssignDeliveryController {
    constructor(private readonly assignService: AssignDeliveryService) {}

    public assign = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = assignDeliverySchema.parse(req.body);
            const updated = await this.assignService.assign(validatedData);
            
            return res.status(200).json({
                success: true,
                message: 'Livreur assigné avec succès',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    }
}
