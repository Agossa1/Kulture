import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAddressService } from '../../../services/get.address.service';
import { AddressRepository } from '../../../repositories/address.repository';
import { AppError } from '../../../../shared/errors/appErrors';

describe('GetAddressService', () => {
    let service: GetAddressService;
    let repository: any;

    beforeEach(() => {
        repository = {
            findById: vi.fn()
        };
        service = new GetAddressService(repository as unknown as AddressRepository);
    });

    it('should return address by id', async () => {
        const address = { id: 'uuid', street: 'Street' };
        repository.findById.mockResolvedValue(address);

        const result = await service.get('uuid');

        expect(result).toEqual(address);
        expect(repository.findById).toHaveBeenCalledWith('uuid');
    });

    it('should propagate AppError', async () => {
        const error = new AppError('Not found', 404);
        repository.findById.mockRejectedValue(error);

        await expect(service.get('uuid')).rejects.toThrow(error);
    });
});
