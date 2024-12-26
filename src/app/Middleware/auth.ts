import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

export interface CustomRequest extends Request {
    user: JwtPayload;
}
const auth = () => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;
            // if the token is sent from the client
            if (!token) {
                throw new AppError(
                    StatusCodes.UNAUTHORIZED,
                    'You are not authorized!'
                );
            }
            // check if the token is valid
            jwt.verify(
                token,
                config.jwt_access_secret as string,
                function (err, decoded) {
                    if (err) {
                        throw new AppError(
                            StatusCodes.UNAUTHORIZED,
                            'You are not authorized!'
                        );
                    }
                    req.user = decoded as JwtPayload;
                    next();
                }
            );
        }
    );
};

export default auth;
