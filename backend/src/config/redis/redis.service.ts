import redisClient from './redisConfig';

/**
 * Service pour interagir avec Redis avec typage simplifié
 */
export const redisService = {
  /**
   * Récupère une valeur typée du cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) as T : null;
    } catch {
      return null;
    }
  },

  /**
   * Enregistre une valeur dans le cache
   * @param key Clé
   * @param value Valeur (sera sérialisée en JSON)
   * @param ttl Durée de vie en secondes
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      const data = JSON.stringify(value);
      await redisClient.set(key, data, { EX: ttl });
    } catch (error) {
      console.error(`[RedisService] Error setting key ${key}:`, error);
    }
  },

  /**
   * Supprime une clé du cache
   */
  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(`[RedisService] Error deleting key ${key}:`, error);
    }
  },

  /**
   * Incrémente une valeur
   */
  async incr(key: string): Promise<number> {
    return redisClient.incr(key);
  },

  /**
   * Définit une expiration
   */
  async expire(key: string, seconds: number): Promise<boolean | number> {
    return redisClient.expire(key, seconds);
  }
};

export default redisClient;

