import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const getAllStudents = async (
    rsq: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB();

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Students are retrieved successfully!',
            data: result
        });
    } catch (err) {
        next(err);
    }
};
const getSingleStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.getSingleStudentFromDB(studentId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Students are retrieved successfully',
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const deleteStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.deleteStudentFromDB(studentId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Student is deleted successfully!',
            data: result
        });
    } catch (err) {
        next(err);
    }
};

export const StudentControllers = {
    getAllStudents,
    getSingleStudent,
    deleteStudent
};
