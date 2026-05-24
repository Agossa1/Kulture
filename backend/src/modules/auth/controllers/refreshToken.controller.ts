import { Request, Response, NextFunction } from "express";
import { RefreshTokenService } from "../services/refreshtoken.service";
import { BadRequestError } from "../../../shared/errors/appErrors";

export class RefreshTokenController {
    constructor(private readonly refreshService: RefreshTokenService) {}

    public refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new BadRequestError('Refresh token manquant');
            }

            const result = await this.refreshService.refresh(refreshToken);

            // Mettre à jour l'Access Token en cookie
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            // Mettre à jour le Refresh Token en cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
            });

            return res.status(200).json({
                success: true,
                message: 'Token rafraîchi avec succès'
            });
        } catch (error) {
            next(error);
        }
    }
}
