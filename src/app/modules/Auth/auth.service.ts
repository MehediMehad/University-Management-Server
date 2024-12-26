import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
    console.log('loginUser payload: ', payload);
    /*
    step 1: check if user exists
    step 2: check if the user already deleted
    step 3: check if the user is blocked
    */

    const isUserExists = await User.findOne({ id: payload.id });
    console.log('isUserExists: ', isUserExists);

    if (!isUserExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is not found');
    } // check if user exists "END" here

    if (isUserExists.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is deleted');
    } // check if the user already deleted "END" here

    const userStatus = isUserExists.status;
    if (userStatus === 'blocked') {
        throw new AppError(StatusCodes.NOT_FOUND, 'The user is blocked');
    } // check if the user is blocked "END" here

    return {};
};

export const AuthServices = {
    loginUser
};
