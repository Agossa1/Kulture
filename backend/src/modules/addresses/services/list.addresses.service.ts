import { AddressRepository } from '../repositories/address.repository';
import { ListAddressesDTO, PaginatedAddresses } from '../types/address.types';
import { AppError } from '../../../shared/errors/appErrors';

export class ListAddressesService {
    constructor(private readonly addressRepository: AddressRepository) {}

    public async list(dto: ListAddressesDTO): Promise<PaginatedAddresses> {
        try {
            return await this.addressRepository.findAll(dto);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new Error('Erreur inattendue lors de la récupération des adresses');
        }
    }
}
