import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../../shared/errors/appErrors';
import { TokenManager } from '../../config/tokens/tokenManager';

const tokenService = new TokenManager();

/**
 * Middleware d'authentification pour protéger les routes.
 * Extrait le token des cookies (HttpOnly) ou du header Authorization.
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError("Accès non autorisé. Token manquant.");
    }

    try {
      const decoded = tokenService.verifyAccessToken(token);
      (req as any).user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedError("Session expirée ou invalide.");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de gestion des rôles (RBAC).
 * Vérifie si l'utilisateur possède l'un des rôles autorisés.
 * @param allowedRoles Liste des rôles autorisés
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        throw new UnauthorizedError("Utilisateur non authentifié.");
      }

      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenError("Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
