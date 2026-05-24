import { Request, Response, NextFunction } from "express";
import { ResendOtpService } from "../services/resendOtp.service";
import { BadRequestError } from "../../../shared/errors/appErrors";

export class ResendOtpController {
    constructor(private readonly resendOtpService: ResendOtpService) {}

    /**
     * Gère la demande de renvoi du code OTP.
     */
    public resend = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { identifier } = req.body;

            if (!identifier) {
                throw new BadRequestError('L\'identifiant (email ou téléphone) est requis');
            }

            await this.resendOtpService.resendOtp(identifier);

            return res.status(200).json({
                success: true,
                message: 'Si un compte correspond à cet identifiant et n\'est pas encore vérifié, un nouveau code a été envoyé.'
            });
        } catch (error) {
            next(error);
        }
    }
}
