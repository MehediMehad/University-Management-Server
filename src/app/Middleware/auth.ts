/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

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
            // checking if the given token is valid
            let decoded;
            try {
                decoded = jwt.verify(
                    token,
                    config.jwt_access_secret as string
                ) as JwtPayload;
            } catch (err) {
                throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
            }

            const { role, userId, iat } = decoded;

            const user = await User.isUserExistByCustomId(userId);

            if (!user) {
                throw new AppError(
                    StatusCodes.NOT_FOUND,
                    'The user is not found'
                );
            }
            if (user?.isDeleted) {
                throw new AppError(
                    StatusCodes.NOT_FOUND,
                    'The user is deleted'
                );
            }
            if (user?.status === 'blocked') {
                throw new AppError(
                    StatusCodes.NOT_FOUND,
                    'The user is blocked'
                );
            }
            if (
                user?.passwordChangeAt &&
                User.isJWTIssuedBeforePasswordChanged(
                    user.passwordChangeAt,
                    iat as number
                )
            ) {
                throw new AppError(
                    StatusCodes.UNAUTHORIZED,
                    'You are not authorized!'
                );
            }
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
};

export default auth;
