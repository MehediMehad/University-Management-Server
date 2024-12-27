import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);

    const { refreshToken, accessToken, needsPasswordChange } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true
    });
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User logged in successfully!',
        data: {
            accessToken,
            needsPasswordChange
        }
    });
});

const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body;

    const result = await AuthServices.changePassword(req.user, passwordData);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Password is updated successfully!',
        data: result
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Access token is retrieved successfully!',
        data: result
    });
});

const forgetPassword = catchAsync(async (req, res) => {
    const userId = req.body.id;
    const result = await AuthServices.forgetPassword(userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Reset link is generated successfully!',
        data: result
    });
});

export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword
};
