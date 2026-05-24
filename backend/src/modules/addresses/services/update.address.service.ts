import { AddressRepository } from '../repositories/address.repository';
import { UpdateAddressDTO, Address } from '../types/address.types';
import { AppError } from '../../../shared/errors/appErrors';

export class UpdateAddressService {
    constructor(private readonly addressRepository: AddressRepository) { }

    public async update(id: string, dto: UpdateAddressDTO): Promise<Address> {
        try {
            return await this.addressRepository.update(id, dto);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new Error("Erreur inattendue lors de la mise à jour de l'adresse");
        }
    }
}
