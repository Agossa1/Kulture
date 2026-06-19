import { Request, Response, NextFunction } from 'express';
import { DeleteStockService } from '../services/delete.stock.service';

export class DeleteStockController {
    constructor(private readonly deleteService: DeleteStockService) {}

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.deleteService.delete(req.params.id as string);
            return res.status(200).json({
                success: true,
                message: 'Stock supprimé avec succès'
            });
        } catch (error) {
            next(error);
        }
    }
}
