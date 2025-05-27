import express, { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../helpers/jwtToken";
import config from "../../config";
import AppError from "../errors/AppError";
import status from "http-status";

const auth = (...roles: string[]) => {
  return (req: Request , res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(status.UNAUTHORIZED, "You are not authorized");
      }

      const verifiedUser = verifyToken(
        token,
        config.jwt_secret_access_token as string
      );

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(status.FORBIDDEN, "FORBIDDEN");
      }

      req.user = verifiedUser;
      next();

      
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
