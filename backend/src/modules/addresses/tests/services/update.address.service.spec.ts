import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateAddressService } from '../../../services/update.address.service';
import { AddressRepository } from '../../../repositories/address.repository';

describe('UpdateAddressService', () => {
    let service: UpdateAddressService;
    let repository: any;

    beforeEach(() => {
        repository = {
            update: vi.fn()
        };
        service = new UpdateAddressService(repository as unknown as AddressRepository);
    });

    it('should update address successfully', async () => {
        const updatedAddress = { id: 'uuid', street: 'New Street' };
        repository.update.mockResolvedValue(updatedAddress);

        const dto = { street: 'New Street' };
        const result = await service.update('uuid', dto);

        expect(result).toEqual(updatedAddress);
        expect(repository.update).toHaveBeenCalledWith('uuid', dto);
    });
});
