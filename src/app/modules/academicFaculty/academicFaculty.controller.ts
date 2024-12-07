import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { AcademicFacultyServices } from './academicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
        req.body
    );
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic faculty is created successfully!',
        data: result
    });
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
    const result =
        await AcademicFacultyServices.getAllAcademicFacultiesFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic faculties is created successfully!',
        data: result
    });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculties
};
