import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
    /*
    step 1: check if user exists
    step 2: check if the user already deleted
    step 3: check if the user is blocked
    step 4: check if the password is correct
    step 4: check if the password is correct
    */
    const user = await User.isUserExistByCustomId(payload.id);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is not found');
    }
    if (user?.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is deleted');
    }
    if (user?.status === 'blocked') {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is blocked');
    }
    // check if the password is correct
    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Password do not matched');
    }
    // crete token and sent to the cline
    const jwtPayload = {
        userId: user.id,
        role: user.role
    };
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string }
) => {
    const user = await User.isUserExistByCustomId(userData.userId);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is not found');
    }
    if (user?.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is deleted');
    }
    if (user?.status === 'blocked') {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is blocked');
    }
    // check if the password is correct
    if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Password do not matched');
    }
    // hash new password
    const newHashPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds)
    );
    await User.findOneAndUpdate(
        {
            id: userData.userId,
            role: userData.role
        },
        {
            password: newHashPassword,
            needsPasswordChange: false,
            passwordChangeAt: new Date()
        }
    );
    return null;
};

const refreshToken = async (token: string) => {
    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    const { userId, iat } = decoded;

    const user = await User.isUserExistByCustomId(userId);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is not found');
    }
    if (user?.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is deleted');
    }
    if (user?.status === 'blocked') {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is blocked');
    }
    if (
        user?.passwordChangeAt &&
        User.isJWTIssuedBeforePasswordChanged(
            user.passwordChangeAt,
            iat as number
        )
    ) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role
    };
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    );
    return {
        accessToken
    };
};
const forgetPassword = async (id: string) => {
    const user = await User.isUserExistByCustomId(id);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is not found');
    }
    if (user?.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is deleted');
    }
    if (user?.status === 'blocked') {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is blocked');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role
    };

    const resetUToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '10m'
    );

    const resetUILink = `${config.reset_pass_ui_link}?=${user?.id}&token=${resetUToken}`;
    sendEmail(user.email, resetUILink);
};
const resetPassword = async (
    payload: { id: string; newPassword: string },
    token: string
) => {
    const user = await User.isUserExistByCustomId(payload.id);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is not found');
    }
    if (user?.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is deleted');
    }
    if (user?.status === 'blocked') {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is blocked');
    }
    const decoded = verifyToken(token, config.jwt_access_secret as string);

    if (payload.id !== decoded.userId) {
        throw new AppError(StatusCodes.FORBIDDEN, 'You are forbidden!');
    }
    // hash new password
    const newHashPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds)
    );
    await User.findOneAndUpdate(
        {
            id: decoded.userId,
            role: decoded.role
        },
        {
            password: newHashPassword,
            passwordChangeAt: new Date(),
            needsPasswordChange: false
        }
    );
};

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
};
