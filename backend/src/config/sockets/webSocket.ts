import { Server as HttpServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { logger } from "../../shared/loggers/logger";

interface AuthenticatedClient extends WebSocket {
  userId?: string;
}

class WsService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, Set<AuthenticatedClient>> = new Map();

  /**
   * Attach the WebSocket server to the existing HTTP server.
   * Call this once after app.listen().
   */
  init(server: HttpServer): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: AuthenticatedClient, req) => {
      // Expect the client to send an auth message: { type: "AUTH", userId: "..." }
      ws.on("message", (raw) => {
        try {
          const data = JSON.parse(raw.toString());

          if (data.type === "AUTH" && data.userId) {
            ws.userId = data.userId;

            if (!this.clients.has(data.userId)) {
              this.clients.set(data.userId, new Set());
            }
            this.clients.get(data.userId)!.add(ws);

            logger.info(`[WS] User ${data.userId} authenticated`);
            ws.send(JSON.stringify({ type: "AUTH_OK" }));
          }
        } catch {
          // Ignore non-JSON frames
        }
      });

      ws.on("close", () => {
        if (ws.userId) {
          const userSockets = this.clients.get(ws.userId);
          if (userSockets) {
            userSockets.delete(ws);
            if (userSockets.size === 0) {
              this.clients.delete(ws.userId);
            }
          }
          logger.info(`[WS] User ${ws.userId} disconnected`);
        }
      });

      ws.on("error", (err) => {
        logger.error("[WS] Socket error:", err);
      });
    });

    logger.info("[WS] WebSocket server initialised on HTTP server");
  }

  /**
   * Send an event payload to a single user by their user ID.
   */
  notifyUser(userId: string, event: string, payload: unknown): void {
    this.notifyUsers([userId], event, payload);
  }

  /**
   * Send an event payload to one or more users by their user IDs.
   */
  notifyUsers(userIds: string[], event: string, payload: unknown): void {
    const message = JSON.stringify({ type: event, data: payload });

    for (const userId of userIds) {
      const userSockets = this.clients.get(userId);
      if (!userSockets) continue;

      for (const client of userSockets) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    }
  }

  /**
   * Broadcast an event to every connected client.
   */
  broadcast(event: string, payload: unknown): void {
    if (!this.wss) return;
    const message = JSON.stringify({ type: event, data: payload });

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export const wsService = new WsService();