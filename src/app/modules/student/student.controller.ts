import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Student } from './student.model';
import AppError from '../../errors/AppError';

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB(req.query);
    // console.log(JSON.stringify(result, null, 1));

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Students are retrieved successfully!',
        meta: result.meta,
        data: result.result
    });
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Students are retrieved successfully',
        data: result
    });
});

const updateStudent: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { student } = req.body;

    const isStudentExist = await Student.findOne({ id: id });
    if (!isStudentExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Student dose not exist');
    }
    const result = await StudentServices.updateStudentIntoDB(id, student);

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
