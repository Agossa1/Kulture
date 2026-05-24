import { Request, Response, NextFunction } from 'express';
import { UpdateDeliveryStatusService } from '../services/update-delivery-status.service';
import { updateDeliveryStatusSchema } from '../validations/update-delivery-status.validations';

export class UpdateDeliveryStatusController {
    constructor(private readonly updateService: UpdateDeliveryStatusService) {}

    public updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = updateDeliveryStatusSchema.parse(req.body);
            const updated = await this.updateService.updateStatus(req.params.id as string, validatedData as any);
            
            return res.status(200).json({
                success: true,
                message: 'Statut de livraison mis à jour',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    }
}
