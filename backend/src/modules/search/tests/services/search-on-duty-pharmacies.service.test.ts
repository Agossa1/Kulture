import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SearchOnDutyPharmaciesService } from '../../services/search-on-duty-pharmacies.service';
import { SearchRepository } from '../../repositories/search.repositories';

describe('SearchOnDutyPharmaciesService', () => {
    let searchService: SearchOnDutyPharmaciesService;
    let searchRepositoryMock: jest.Mocked<SearchRepository>;
    let loggerMock: any;

    const mockResults = [
        { id: '1', name: 'Pharmacie de Garde', distance: 50 }
    ];

    beforeEach(() => {
        searchRepositoryMock = {
            findOnDutyPharmaciesInCity: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        searchService = new SearchOnDutyPharmaciesService(searchRepositoryMock, loggerMock);
    });

    it('should return on-duty pharmacies in city', async () => {
        searchRepositoryMock.findOnDutyPharmaciesInCity.mockResolvedValue(mockResults as any);

        const result = await searchService.searchOnDutyInCity({ cityName: 'Paris', limit: 5 });

        expect(result).toHaveLength(1);
        expect(searchRepositoryMock.findOnDutyPharmaciesInCity).toHaveBeenCalledWith(expect.objectContaining({
            cityName: 'Paris',
            limit: 5
        }));
    });
});
