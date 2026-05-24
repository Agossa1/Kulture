import { SearchRepository } from "../repositories/search.repositories";
import type { Logger } from 'winston';
import { MedicineAvailabilityResponse } from "../types/search.types";

export class SearchAvailabilityService {
    constructor(
        private readonly searchRepository: SearchRepository,
        private readonly logger: Logger
    ) {}

    /**
     * Calcule la disponibilité d'un médicament et suggère des alternatives géographiques
     * si nécessaire.
     */
    public async searchAvailability(params: {
        medicineId: string;
        latitude: number;
        longitude: number;
        radiusKm: number;
        targetPharmacyId?: string;
        limit: number;
    }): Promise<MedicineAvailabilityResponse> {
        try {
            const response: MedicineAvailabilityResponse = {
                requestedMedicineId: params.medicineId,
                nearbyPharmacies: [],
                nearbyCities: []
            };

            // 1. Vérifier la cible prioritaire (si l'utilisateur a scanné/choisi une pharmacie)
            if (params.targetPharmacyId) {
                response.isAvailableInRequestedPharmacy = await this.searchRepository.checkAvailabilityInPharmacy(
                    params.medicineId, 
                    params.targetPharmacyId
                );
            }

            // 2. Chercher dans les pharmacies environnantes
            response.nearbyPharmacies = await this.searchRepository.findNearbyPharmaciesWithStock(
                params.medicineId,
                params.longitude,
                params.latitude,
                params.radiusKm,
                params.limit
            );

            // 3. Si très peu ou pas de pharmacies trouvées, suggérer des villes aux alentours
            if (response.nearbyPharmacies.length < 2) {
                response.nearbyCities = await this.searchRepository.findNearbyCitiesWithStock(
                    params.medicineId,
                    params.longitude,
                    params.latitude,
                    params.radiusKm,
                    params.limit
                );
            }

            return response;
        } catch (error) {
            this.logger.error('Error in SearchAvailabilityService:', error);
            throw error;
        }
    }
}
