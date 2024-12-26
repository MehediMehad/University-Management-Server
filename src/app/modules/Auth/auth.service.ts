import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
    console.log('loginUser payload: ', payload);

    return {};
};

export const AuthServices = {
    loginUser
};
