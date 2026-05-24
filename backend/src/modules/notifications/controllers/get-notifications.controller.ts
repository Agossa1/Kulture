import { Request, Response, NextFunction } from 'express';
import { GetNotificationsService } from '../services/get-notifications.service';

export class GetNotificationsController {
    constructor(private readonly getService: GetNotificationsService) {}

    public getNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.getService.getNotifications(authId as string, page, limit);
            
            return res.status(200).json({
                success: true,
                data: result.notifications,
                meta: {
                    total: result.total,
                    page,
                    limit
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
