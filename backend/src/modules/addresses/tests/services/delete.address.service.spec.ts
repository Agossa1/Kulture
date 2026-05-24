import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteAddressService } from '../../../services/delete.address.service';
import { AddressRepository } from '../../../repositories/address.repository';

describe('DeleteAddressService', () => {
    let service: DeleteAddressService;
    let repository: any;

    beforeEach(() => {
        repository = {
            delete: vi.fn()
        };
        service = new DeleteAddressService(repository as unknown as AddressRepository);
    });

    it('should delete address successfully', async () => {
        repository.delete.mockResolvedValue(undefined);

        await service.delete('uuid');

        expect(repository.delete).toHaveBeenCalledWith('uuid');
    });
});
