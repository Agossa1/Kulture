import type { Logger } from 'winston';
import PostgresDatabase from '../../../infra/database/postgres';
import { Cart, CartItem, AddToCartDTO } from '../types/cart.types';
import { BadRequestError, NotFoundError } from '../../../shared/errors/appErrors';

/**
 * Repository gérant le panier et les items du panier.
 */
export class CartRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    /**
     * Récupère le panier d'un utilisateur pour une pharmacie spécifique.
     */
    public async findCart(authId: string, pharmacyId: string): Promise<Cart | null> {
        try {
            const sql = `
                SELECT 
                    c.id, c.auth_id as "authId", c.pharmacy_id as "pharmacyId",
                    c.created_at as "createdAt", c.updated_at as "updatedAt",
                    p.name as "pharmacyName"
                FROM cart c
                JOIN pharmacy p ON c.pharmacy_id = p.id
                WHERE c.auth_id = $1 AND c.pharmacy_id = $2
            `;
            const result = await this.db.query(sql, [authId, pharmacyId]);
            if (result.rows.length === 0) return null;

            const cart = result.rows[0];
            cart.items = await this.findCartItems(cart.id);

            return cart;
        } catch (error) {
            this.logger.error(`Error fetching cart for user ${authId}:`, error);
            throw new BadRequestError('Failed to fetch cart');
        }
    }

    /**
     * Récupère tous les items d'un panier.
     */
    private async findCartItems(cartId: string): Promise<CartItem[]> {
        const sql = `
            SELECT 
                ci.id, ci.cart_id as "cartId", ci.medicine_id as "medicineId",
                ci.quantity, ci.created_at as "createdAt", ci.updated_at as "updatedAt",
                m.business_name as "medicineName",
                m.cip_code as "medicineCIP"
            FROM cart_items ci
            JOIN medicine m ON ci.medicine_id = m.id
            WHERE ci.cart_id = $1
            ORDER BY ci.created_at ASC
        `;
        const result = await this.db.query(sql, [cartId]);
        return result.rows;
    }

    /**
     * Ajoute un médicament au panier (crée le panier si nécessaire).
     */
    public async addItem(dto: AddToCartDTO): Promise<Cart> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Trouver ou créer le panier
            let cartResult = await client.query(
                `SELECT id FROM cart WHERE auth_id = $1 AND pharmacy_id = $2`,
                [dto.authId, dto.pharmacyId]
            );

            let cartId: string;
            if (cartResult.rows.length === 0) {
                const newCart = await client.query(
                    `INSERT INTO cart (auth_id, pharmacy_id) VALUES ($1, $2) RETURNING id`,
                    [dto.authId, dto.pharmacyId]
                );
                cartId = newCart.rows[0].id;
            } else {
                cartId = cartResult.rows[0].id;
            }

            // 2. Ajouter ou mettre à jour l'item (UPSERT)
            await client.query(`
                INSERT INTO cart_items (cart_id, medicine_id, quantity)
                VALUES ($1, $2, $3)
                ON CONFLICT (cart_id, medicine_id) 
                DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = NOW()
            `, [cartId, dto.medicineId, dto.quantity]);

            await client.query('COMMIT');
            
            // Retourner le panier complet mis à jour
            const finalCart = await this.findCart(dto.authId, dto.pharmacyId);
            return finalCart!;
        } catch (error) {
            await client.query('ROLLBACK');
            this.logger.error('Error adding item to cart:', error);
            throw new BadRequestError('Failed to add item to cart');
        } finally {
            client.release();
        }
    }

    /**
     * Met à jour la quantité d'un item spécifique.
     */
    public async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
        try {
            const sql = `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2`;
            const result = await this.db.query(sql, [quantity, itemId]);
            if (result.rowCount === 0) throw new NotFoundError('Cart item not found');
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error updating cart item ${itemId}:`, error);
            throw new BadRequestError('Failed to update cart item');
        }
    }

    /**
     * Supprime un item du panier.
     */
    public async removeItem(itemId: string): Promise<void> {
        try {
            const sql = `DELETE FROM cart_items WHERE id = $1`;
            const result = await this.db.query(sql, [itemId]);
            if (result.rowCount === 0) throw new NotFoundError('Cart item not found');
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error removing cart item ${itemId}:`, error);
            throw new BadRequestError('Failed to remove cart item');
        }
    }

    /**
     * Vide complètement le panier.
     */
    public async clearCart(cartId: string): Promise<void> {
        try {
            const sql = `DELETE FROM cart_items WHERE cart_id = $1`;
            await this.db.query(sql, [cartId]);
        } catch (error) {
            this.logger.error(`Error clearing cart ${cartId}:`, error);
            throw new BadRequestError('Failed to clear cart');
        }
    }
}
