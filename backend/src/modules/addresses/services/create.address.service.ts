import { AddressRepository } from '../repositories/address.repository';
import { CreateAddressDTO, Address } from '../types/address.types';
import { AppError } from '../../../shared/errors/appErrors';

export class CreateAddressService {
    constructor(private readonly addressRepository: AddressRepository) {}

    public async create(dto: CreateAddressDTO): Promise<Address> {
        try {
            return await this.addressRepository.create(dto);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new Error("Erreur inattendue lors de la création de l'adresse");
        }
    }
}
