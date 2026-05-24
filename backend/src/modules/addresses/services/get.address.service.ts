import { AddressRepository } from '../repositories/address.repository';
import { Address } from '../types/address.types';
import { AppError } from '../../../shared/errors/appErrors';

export class GetAddressService {
    constructor(private readonly addressRepository: AddressRepository) {}

    public async get(id: string): Promise<Address> {
        try {
            return await this.addressRepository.findById(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new Error("Erreur inattendue lors de la récupération de l'adresse");
        }
    }
}
