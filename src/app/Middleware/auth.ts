import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

export interface CustomRequest extends Request {
    user: JwtPayload;
}
const auth = (...requiredRoles: TUserRole[]) => {
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
                    const role = (decoded as JwtPayload).role;
                    if (requiredRoles && !requiredRoles.includes(role)) {
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
