import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
};
