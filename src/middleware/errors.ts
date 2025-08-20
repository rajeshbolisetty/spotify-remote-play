import { NextFunction, Request, Response } from 'express';
import { APIError } from '../error';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof APIError) {
    res.status(err.code).json({ error: err.message, detail: err.detail });
    return;
  }

  console.error('INTERNAL SERVER ERROR:', err.message, err.stack);
  res.status(500).json({ error: 'Internal server error' });
}
