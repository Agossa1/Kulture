export interface Address {
    id: string;
    neighborhoodId: string;
    street: string;
    postalCode: string;
    location?: any; 
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAddressDTO {
    neighborhoodId: string;
    street: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}

export interface UpdateAddressDTO {
    neighborhoodId?: string;
    street?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}

export interface ListAddressesDTO {
    limit: number;
    offset: number;
    neighborhoodId?: string;
}

export interface PaginatedAddresses {
    items: Address[];
    total: number;
}
