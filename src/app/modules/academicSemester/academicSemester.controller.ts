import { RequestHandler } from 'express';
// import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';

const createAcademicSemester RequestHandler = catchAsync(async (req, res) => {
    // const { password, student: studentData } = req.body;

    // const result = await UserServices.createStudentIntoDB(
    //     password,
    //     studentData
    // );
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student is created successfully!',
        data: result
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester
};
