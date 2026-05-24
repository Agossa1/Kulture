import { AddressRepository } from '../repositories/address.repository';
import { AppError } from '../../../shared/errors/appErrors';

export class DeleteAddressService {
    constructor(private readonly addressRepository: AddressRepository) {}

    public async delete(id: string): Promise<void> {
        try {
            await this.addressRepository.delete(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new Error("Erreur inattendue lors de la suppression de l'adresse");
        }
    }
}
