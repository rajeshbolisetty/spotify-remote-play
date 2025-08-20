import { Request, Response, NextFunction } from 'express';

export function getHealthStatus(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}
