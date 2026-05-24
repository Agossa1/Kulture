import { Request, Response, NextFunction } from 'express';
import { MarkAsReadService } from '../services/mark-as-read.service';

export class MarkAsReadController {
    constructor(private readonly markAsReadService: MarkAsReadService) {}

    public markAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.markAsReadService.markAsRead(id as string);
            return res.status(200).json({ success: true, message: 'Notification marquée comme lue' });
        } catch (error) {
            next(error);
        }
    }

    public markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authId } = req.params;
            await this.markAsReadService.markAllAsRead(authId as string);
            return res.status(200).json({ success: true, message: 'Toutes les notifications ont été marquées comme lues' });
        } catch (error) {
            next(error);
        }
    }
}
