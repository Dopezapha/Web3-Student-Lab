import { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(message: string, data?: T): ApiResponseData<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, error?: any): ApiResponseData {
    return {
      success: false,
      message,
      error: error?.message || error,
      timestamp: new Date().toISOString(),
    };
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: any, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const sendSuccess = (res: Response, data: any) => {
  return res.status(200).json({
    status: 'success',
    ...data,
  });
};

export const sendError = (res: Response, error: any, statusCode: number = 500) => {
  return res.status(statusCode).json({
    status: 'error',
    message: error.message || 'An error occurred',
    ...(process.env.NODE_ENV === 'development' && { error: error.stack }),
  });
};
