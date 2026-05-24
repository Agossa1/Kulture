import { Request, Response, NextFunction } from 'express';
import { UpdateOrderStatusService } from '../services/update.order.service';
import { updateOrderStatusSchema } from '../validations/update.order.validations';

export class UpdateOrderStatusController {
    constructor(private readonly updateService: UpdateOrderStatusService) {}

    public updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = updateOrderStatusSchema.parse(req.body);
            const updated = await this.updateService.updateStatus(req.params.id as string, validatedData);
            return res.status(200).json({
                success: true,
                message: 'Statut de la commande mis à jour',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    }
}
