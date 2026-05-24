import { Request, Response, NextFunction } from 'express';
import { CreateAddressService } from '../services/create.address.service';
import { createAddressSchema } from '../validations/create.address.validations';

export class CreateAddressController {
    constructor(private readonly createService: CreateAddressService) {}

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = createAddressSchema.parse(req.body);
            const address = await this.createService.create(validatedData);
            
            return res.status(201).json({
                success: true,
                message: 'Adresse créée avec succès',
                data: address
            });
        } catch (error) {
            next(error);
        }
    }
}
