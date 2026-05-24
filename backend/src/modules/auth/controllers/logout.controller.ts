import { Request, Response, NextFunction } from "express";
import { LogoutService } from "../services/logout.service";

export class LogoutController {
    constructor(private readonly logoutService: LogoutService) {}

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;

            if (refreshToken) {
                await this.logoutService.logout(refreshToken);
            }

            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');

            return res.status(200).json({
                success: true,
                message: 'Déconnexion réussie'
            });
        } catch (error) {
            next(error);
        }
    }
}
