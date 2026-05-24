import { Request, Response, NextFunction } from 'express';
import { ListAddressesService } from '../services/list.addresses.service';
import { listAddressesSchema } from '../validations/list.addresses.validations';

export class ListAddressesController {
    constructor(private readonly listService: ListAddressesService) {}

    public list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = listAddressesSchema.parse(req.query);
            const result = await this.listService.list(validatedData);
            
            return res.status(200).json({
                success: true,
                data: result.items,
                meta: {
                    total: result.total,
                    limit: validatedData.limit,
                    offset: validatedData.offset
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
