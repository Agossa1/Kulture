import { Request, Response, NextFunction } from 'express';
import { GetAddressService } from '../services/get.address.service';

export class GetAddressController {
    constructor(private readonly getService: GetAddressService) {}

    public get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const address = await this.getService.get(id);
            
            return res.status(200).json({
                success: true,
                data: address
            });
        } catch (error) {
            next(error);
        }
    }
}
