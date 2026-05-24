import { createServer } from "./server"
import { appConfig } from "./config/app/appConfig"
import { logger } from "./shared/loggers/logger"
import PostgresDatabase from './infra/database/postgres';
import client from "./config/redis/redisConfig";
import { wsService } from "./config/sockets/webSocket";



const start = async () => {
  try {
    const database = new PostgresDatabase();
    await database.connect() 


    // Check if client is already open before connecting
    if (!client.isOpen) {
        await client.connect();
        logger.info('✅ Redis connected');
    }

    const app = await createServer(database)
    const server = app.listen(appConfig.app.port, () => {
      logger.info(`🚀 Server running on port ${appConfig.app.port}`)
    })

    // Initialiser WebSockets avec le server HTTP
    wsService.init(server);


    return server
  } catch (error) {
    logger.error('❌ Error starting server', error)
    process.exit(1)
  }
}

start()