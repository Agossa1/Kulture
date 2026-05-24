export interface Country {
    id: string;
    name: string;
    code: string; // ISO3
    area_sqkm?: number;
    center_lat?: number;
    center_long?: number;
    geometry?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Region {
    id: string;
    country_id: string;
    name: string;
    code: string;
    geometry: string;
    created_at: Date;
    updated_at: Date;
}

export interface City {
    id: string;
    region_id: string;
    name: string;
    area_sqkm?: number;
    center_lat?: number;
    center_long?: number;
    geometry?: string;
    created_at: Date;
    updated_at: Date;
}

export interface District {
    id: string;
    city_id: string;
    name: string;
    area_sqkm?: number;
    population?: number;
    center_lat?: number;
    center_long?: number;
    geometry?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Neighborhood {
    id: string;
    district_id: string; // Hiérarchie : City -> District -> Neighborhood
    name: string;
    geometry?: string;
    created_at: Date;
    updated_at: Date;
}

