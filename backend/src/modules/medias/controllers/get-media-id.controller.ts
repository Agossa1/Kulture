import { Request, Response, NextFunction } from 'express';
import { GetStockByIdService } from '../services/get-stock-id.service';

export class GetStockByIdController {
    constructor(private readonly getByIdService: GetStockByIdService) {}

    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stock = await this.getByIdService.getById(req.params.id as string);
            return res.status(200).json({
                success: true,
                data: stock
            });
        } catch (error) {
            next(error);
        }
    }
}
