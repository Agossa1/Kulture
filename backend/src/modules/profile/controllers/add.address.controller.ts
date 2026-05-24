import { Request, Response, NextFunction } from 'express';
import { AddAddressService } from '../services/add.address.service';
import { addAddressSchema } from '../validations/add.address.validations';

export class AddAddressController {
    constructor(private readonly addService: AddAddressService) {}

    public add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = addAddressSchema.parse(req.body);
            const address = await this.addService.add(req.params.authId as string, validatedData);
            return res.status(201).json({
                success: true,
                message: 'Adresse ajoutée au profil',
                data: address
            });
        } catch (error) {
            next(error);
        }
    }
}
