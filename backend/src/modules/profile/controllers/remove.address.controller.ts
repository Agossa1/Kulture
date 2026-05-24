import { Request, Response, NextFunction } from 'express';
import { RemoveAddressService } from '../services/remove.address.service';

export class RemoveAddressController {
    constructor(private readonly removeService: RemoveAddressService) {}

    public remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.removeService.remove(req.params.authId as string, req.params.addressId as string);
            return res.status(200).json({ success: true, message: 'Adresse supprimée du profil' });
        } catch (error) {
            next(error);
        }
    }
}
