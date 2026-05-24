export interface NearbyPharmacySuggestion {
    pharmacyId: string;
    pharmacyName: string;
    addressStreet: string;
    distanceKm: number;
    availableQuantity: number;
    price: number;
    isOnDuty: boolean;
}

export interface CitySuggestion {
    cityId: string;
    cityName: string;
    regionName: string;
    availablePharmaciesCount: number;
    minPrice: number;
}

export interface MedicineAvailabilityResponse {
    requestedMedicineId: string;
    isAvailableInRequestedPharmacy?: boolean;
    nearbyPharmacies: NearbyPharmacySuggestion[];
    nearbyCities: CitySuggestion[];
}

export interface PharmacyCityResult {
    pharmacyId: string;
    pharmacyName: string;
    addressStreet: string;
    neighborhoodName: string;
    isOnDuty: boolean;
    status: string;
    phoneNumber?: string;
    distanceKm?: number; // Optionnel si on donne les coordonnées GPS pour trier dans la ville
}

