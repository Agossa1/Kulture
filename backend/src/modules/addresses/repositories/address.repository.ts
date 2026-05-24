import type { Logger } from 'winston';
import PostgresDatabase from '../../../infra/database/postgres';
import { Address, CreateAddressDTO, UpdateAddressDTO, ListAddressesDTO, PaginatedAddresses } from '../types/address.types';
import { BadRequestError, NotFoundError } from '../../../shared/errors/appErrors';

export class AddressRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    public async create(dto: CreateAddressDTO): Promise<Address> {
        try {
            const sql = `
                INSERT INTO address (neighborhood_id, street, postal_code, location)
                VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))
                RETURNING id, neighborhood_id as "neighborhoodId", street, postal_code as "postalCode", ST_AsGeoJSON(location) as location, created_at as "createdAt", updated_at as "updatedAt"
            `;
            const result = await this.db.query(sql, [
                dto.neighborhoodId, 
                dto.street, 
                dto.postalCode, 
                dto.longitude, 
                dto.latitude
            ]);
            
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error creating address:', error);
            throw new BadRequestError('Failed to create address');
        }
    }

    public async findById(id: string): Promise<Address> {
        try {
            const sql = `
                SELECT id, neighborhood_id as "neighborhoodId", street, postal_code as "postalCode", ST_AsGeoJSON(location) as location, created_at as "createdAt", updated_at as "updatedAt"
                FROM address
                WHERE id = $1 AND deleted_at IS NULL
            `;
            const result = await this.db.query(sql, [id]);
            
            if (result.rows.length === 0) {
                throw new NotFoundError('Address not found');
            }
            
            return result.rows[0];
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error('Error finding address by id:', error);
            throw new BadRequestError('Failed to fetch address');
        }
    }

    public async findAll(dto: ListAddressesDTO): Promise<PaginatedAddresses> {
        try {
            const values: any[] = [];
            let whereClause = 'WHERE deleted_at IS NULL';
            let paramIndex = 1;

            if (dto.neighborhoodId) {
                whereClause += ` AND neighborhood_id = $${paramIndex}`;
                values.push(dto.neighborhoodId);
                paramIndex++;
            }

            const countSql = `SELECT COUNT(*) FROM address ${whereClause}`;
            const countResult = await this.db.query(countSql, values);
            const total = parseInt(countResult.rows[0].count, 10);

            const sql = `
                SELECT id, neighborhood_id as "neighborhoodId", street, postal_code as "postalCode", ST_AsGeoJSON(location) as location, created_at as "createdAt", updated_at as "updatedAt"
                FROM address
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
            `;
            values.push(dto.limit, dto.offset);

            const result = await this.db.query(sql, values);

            return {
                items: result.rows,
                total
            };
        } catch (error) {
            this.logger.error('Error finding all addresses:', error);
            throw new BadRequestError('Failed to fetch addresses');
        }
    }

    public async update(id: string, dto: UpdateAddressDTO): Promise<Address> {
        try {
            const setClauses: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (dto.neighborhoodId !== undefined) {
                setClauses.push(`neighborhood_id = $${paramIndex++}`);
                values.push(dto.neighborhoodId);
            }
            if (dto.street !== undefined) {
                setClauses.push(`street = $${paramIndex++}`);
                values.push(dto.street);
            }
            if (dto.postalCode !== undefined) {
                setClauses.push(`postal_code = $${paramIndex++}`);
                values.push(dto.postalCode);
            }
            if (dto.latitude !== undefined && dto.longitude !== undefined) {
                setClauses.push(`location = ST_SetSRID(ST_MakePoint($${paramIndex++}, $${paramIndex++}), 4326)`);
                values.push(dto.longitude, dto.latitude);
            }

            if (setClauses.length === 0) {
                return this.findById(id);
            }

            setClauses.push(`updated_at = NOW()`);

            const sql = `
                UPDATE address
                SET ${setClauses.join(', ')}
                WHERE id = $${paramIndex} AND deleted_at IS NULL
                RETURNING id, neighborhood_id as "neighborhoodId", street, postal_code as "postalCode", ST_AsGeoJSON(location) as location, created_at as "createdAt", updated_at as "updatedAt"
            `;
            values.push(id);

            const result = await this.db.query(sql, values);

            if (result.rows.length === 0) {
                throw new NotFoundError('Address not found');
            }

            return result.rows[0];
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error('Error updating address:', error);
            throw new BadRequestError('Failed to update address');
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            const sql = `
                UPDATE address
                SET deleted_at = NOW()
                WHERE id = $1 AND deleted_at IS NULL
            `;
            const result = await this.db.query(sql, [id]);
            
            if (result.rowCount === 0) {
                throw new NotFoundError('Address not found');
            }
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error('Error deleting address:', error);
            throw new BadRequestError('Failed to delete address');
        }
    }
}
