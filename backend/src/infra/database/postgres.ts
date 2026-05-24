import { Pool, PoolClient } from 'pg';
import databaseConfig from './database';
import { Database } from './types';
import { logger } from '../../shared/loggers/logger';

/**
 * Implémentation PostgreSQL du service Database
 */
export default class PostgresDatabase implements Database {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      database: databaseConfig.database,
    });

    this.pool.on("error", (error: Error) => {
      logger.error("PostgreSQL pool error", error);
    });
  }

  async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query("SELECT 1");
        logger.info("PostgreSQL connected ✅");
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Unable to connect to PostgreSQL ❌", error);
      throw error;
    }
  }

  /**
   * Retourne un client du pool pour les transactions
   */
  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  /**
   * Exécute une requête SQL simple (pas de transaction)
   * @returns Le tableau de résultats (rows)
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<any> {
    // Note: On retourne l'objet QueryResult complet pour être compatible avec l'usage actuel .rows
    return await this.pool.query(sql, params);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}