import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;

    const result = await UserServices.createStudentIntoDB(
        password,
        studentData
    );
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student is created successfully!',
        data: result
    });
});
const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body;

    const result = await UserServices.createFacultyIntoDB(
        password,
        facultyData
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculty is created successfully',
        data: result
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;

    const result = await UserServices.createAdminIntoDB(password, adminData);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin is created successfully',
        data: result
    });
});

const getMe = catchAsync(async (req, res) => {
    const { userId, role } = req.user;
    const result = await UserServices.getMe(userId, role);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `${role} is retrieved successfully`,
        data: result
    });
});

export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe
};
