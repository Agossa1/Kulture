import { Request, Response, NextFunction } from 'express';
import { DeleteAddressService } from '../services/delete.address.service';

export class DeleteAddressController {
    constructor(private readonly deleteService: DeleteAddressService) {}

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            await this.deleteService.delete(id);
            
            return res.status(200).json({
                success: true,
                message: 'Adresse supprimée avec succès'
            });
        } catch (error) {
            next(error);
        }
    }
}
