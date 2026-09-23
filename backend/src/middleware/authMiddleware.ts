import { NextFunction, Request, Response } from "express";
import { ENV } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = req.cookies?.access_token || bearerToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied." });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRETE as string) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized User",
      error,
    });
  }
};