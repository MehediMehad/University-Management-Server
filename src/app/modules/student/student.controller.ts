import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Student } from './student.model';
import AppError from '../../errors/AppError';

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Students are retrieved successfully!',
        data: result
    });
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Students are retrieved successfully',
        data: result
    });
});

const updateStudent: RequestHandler = catchAsync(async (req, res) => {
    const { studentId } = req.params;

    const isStudentExist = await Student.findOne({ id: studentId });
    if (!isStudentExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Student dose not exist');
    }
    const result = await StudentServices.deleteStudentFromDB(studentId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student is updated successfully!',
        data: result
    });
});

const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
    const { studentId } = req.params;

    const isStudentExist = await Student.findOne({ id: studentId });
    if (!isStudentExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Student dose not exist');
    }
    const result = await StudentServices.deleteStudentFromDB(studentId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student is deleted successfully!',
        data: result
    });
});
export const StudentControllers = {
    getAllStudents,
    getSingleStudent,
    updateStudent,
    deleteStudent
};
