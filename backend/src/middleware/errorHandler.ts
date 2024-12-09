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
): void => {
  const statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  try {
    message = typeof message === "string" ? JSON.parse(err.message) : message;
  } catch (error) {
    message = message;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Error: ", err);
    res.status(statusCode).json({ status: "error", message, stack: err.stack });
    return;
  }

  res.status(statusCode).json({ status: "error", message });
};

export default errorHandler;
