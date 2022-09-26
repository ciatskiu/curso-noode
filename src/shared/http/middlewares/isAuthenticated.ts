
import authConfig from "@config/auth";
import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface ITokenPayload{
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticadted(
  request: Request, response: Response, next: NextFunction): void{
    const authHeader = request.headers.authorization;
    if(!authHeader){
      throw new AppError('JWT Token is missing.');
    }
    const [type, token] = authHeader.split(' ');
    try{
      const decodeToken = verify(token, authConfig.jwt.secret);

      const { sub } = decodeToken as ITokenPayload;
      request.user = { id: sub, } //subscribe @types/express/index.d.ts

      return next();
    }catch{
      throw new AppError('Invalid JWT Token.');
    }
  }
