import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';

const loginUser = async (payload: TLoginUser) => {
    console.log('loginUser payload: ', payload);
    /*
    step 1: check if user exists
    step 2: check if the user already deleted
    step 3: check if the user is blocked
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

    return {};
};

export const AuthServices = {
    loginUser
};
