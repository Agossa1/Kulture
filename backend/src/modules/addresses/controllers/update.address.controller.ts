import { Request, Response, NextFunction } from 'express';
import { UpdateAddressService } from '../services/update.address.service';
import { updateAddressSchema } from '../validations/update.address.validations';

export class UpdateAddressController {
    constructor(private readonly updateService: UpdateAddressService) {}

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const validatedData = updateAddressSchema.parse(req.body);
            const address = await this.updateService.update(id, validatedData);
            
            return res.status(200).json({
                success: true,
                message: 'Adresse mise à jour avec succès',
                data: address
            });
        } catch (error) {
            next(error);
        }
    }
}
