import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SearchAllPharmaciesService } from '../../services/search-all-pharmacies.service';
import { SearchRepository } from '../../repositories/search.repositories';

describe('SearchAllPharmaciesService', () => {
    let searchService: SearchAllPharmaciesService;
    let searchRepositoryMock: jest.Mocked<SearchRepository>;
    let loggerMock: any;

    const mockResults = [
        { id: '1', name: 'Pharmacie A', distance: 100 },
        { id: '2', name: 'Pharmacie B', distance: 200 }
    ];

    beforeEach(() => {
        searchRepositoryMock = {
            findAllPharmaciesInCity: jest.fn(),
        } as any;

        loggerMock = {
            error: jest.fn(),
            info: jest.fn(),
        };

        searchService = new SearchAllPharmaciesService(searchRepositoryMock, loggerMock);
    });

    it('should return pharmacies in city', async () => {
        searchRepositoryMock.findAllPharmaciesInCity.mockResolvedValue(mockResults as any);

        const result = await searchService.searchAllInCity({ cityName: 'Paris', limit: 10 });

        expect(result).toHaveLength(2);
        expect(searchRepositoryMock.findAllPharmaciesInCity).toHaveBeenCalledWith(expect.objectContaining({
            cityName: 'Paris',
            limit: 10
        }));
    });
});
