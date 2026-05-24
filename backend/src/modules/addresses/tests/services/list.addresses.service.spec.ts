import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListAddressesService } from '../../../services/list.addresses.service';
import { AddressRepository } from '../../../repositories/address.repository';

describe('ListAddressesService', () => {
    let service: ListAddressesService;
    let repository: any;

    beforeEach(() => {
        repository = {
            findAll: vi.fn()
        };
        service = new ListAddressesService(repository as unknown as AddressRepository);
    });

    it('should return paginated addresses', async () => {
        const paginatedResult = { items: [{ id: 'uuid' }], total: 1 };
        repository.findAll.mockResolvedValue(paginatedResult);

        const dto = { limit: 10, offset: 0 };
        const result = await service.list(dto);

        expect(result).toEqual(paginatedResult);
        expect(repository.findAll).toHaveBeenCalledWith(dto);
    });
});
