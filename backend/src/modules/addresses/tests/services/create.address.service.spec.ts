import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateAddressService } from '../../services/create.address.service';
import { AddressRepository } from '../../repositories/address.repository';
import { CreateAddressDTO } from '../../types/address.types';

describe('CreateAddressService', () => {
    let service: CreateAddressService;
    let repository: any;

    beforeEach(() => {
        repository = {
            create: vi.fn()
        };
        service = new CreateAddressService(repository as unknown as AddressRepository);
    });

    it('should successfully create an address', async () => {
        const dto: CreateAddressDTO = {
            neighborhoodId: 'uuid',
            street: 'Main St',
            postalCode: '12345',
            latitude: 10,
            longitude: 20
        };

        const expectedAddress = { id: 'address-id', ...dto };
        repository.create.mockResolvedValue(expectedAddress);

        const result = await service.create(dto);

        expect(result).toEqual(expectedAddress);
        expect(repository.create).toHaveBeenCalledWith(dto);
    });

    it('should throw error if repository throws', async () => {
        const dto: CreateAddressDTO = {
            neighborhoodId: 'uuid',
            street: 'Main St',
            postalCode: '12345',
            latitude: 10,
            longitude: 20
        };

        repository.create.mockRejectedValue(new Error('DB Error'));

        await expect(service.create(dto)).rejects.toThrow("Erreur inattendue lors de la création de l'adresse");
    });
});
