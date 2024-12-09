import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types/auth";

export class AppError extends Error {
  public statusCode: number | undefined;

  constructor(message: ApiResponse, statusCode?: number) {
    super(typeof message === "string" ? message : JSON.stringify(message));
    this.statusCode = statusCode;
  }
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  try {
    message = typeof message === "string" ? JSON.parse(err.message) : message;
  } catch (error) {
    message = message;
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;
