import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message?: string, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  });
};

export const sendError = (res: Response, error: string, statusCode = 500, details?: any) => {
  return res.status(statusCode).json({
    success: false,
    error,
    details,
    timestamp: new Date().toISOString()
  });
};