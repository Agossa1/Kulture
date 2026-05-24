import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SearchAvailabilityService } from '../../services/search-availability.service';
import { SearchRepository } from '../../repositories/search.repositories';

describe('SearchAvailabilityService', () => {
    let searchService: SearchAvailabilityService;
    let searchRepositoryMock: jest.Mocked<SearchRepository>;
    let loggerMock: any;

    beforeEach(() => {
        searchRepositoryMock = {
            checkAvailabilityInPharmacy: jest.fn(),
            findNearbyPharmaciesWithStock: jest.fn(),
            findNearbyCitiesWithStock: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        searchService = new SearchAvailabilityService(searchRepositoryMock, loggerMock);
    });

    it('should check availability and return nearby pharmacies', async () => {
        searchRepositoryMock.checkAvailabilityInPharmacy.mockResolvedValue(true);
        searchRepositoryMock.findNearbyPharmaciesWithStock.mockResolvedValue([
            { id: 'p1', name: 'Pharm 1', distance: 1 }
        ] as any);

        const result = await searchService.searchAvailability({
            medicineId: 'med-1',
            latitude: 48,
            longitude: 2,
            radiusKm: 10,
            targetPharmacyId: 'p-target',
            limit: 5
        });

        expect(result.isAvailableInRequestedPharmacy).toBe(true);
        expect(result.nearbyPharmacies).toHaveLength(1);
        expect(searchRepositoryMock.checkAvailabilityInPharmacy).toHaveBeenCalledWith('med-1', 'p-target');
    });

    it('should suggest nearby cities if few pharmacies are found', async () => {
        searchRepositoryMock.findNearbyPharmaciesWithStock.mockResolvedValue([]);
        searchRepositoryMock.findNearbyCitiesWithStock.mockResolvedValue([
            { id: 'c1', name: 'City 1', distance: 20 }
        ] as any);

        const result = await searchService.searchAvailability({
            medicineId: 'med-1',
            latitude: 48,
            longitude: 2,
            radiusKm: 10,
            limit: 5
        });

        expect(result.nearbyCities).toHaveLength(1);
        expect(searchRepositoryMock.findNearbyCitiesWithStock).toHaveBeenCalled();
    });
});
