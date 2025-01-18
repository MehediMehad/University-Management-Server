import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
        req.body
    );
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic semester is created successfully!',
        data: result
    });
});

const getAllAcademicSemesters = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB(
        req.query
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic semester is retrieved successfully !',
        meta: result.meta,
        data: result.result
    });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result =
        await AcademicSemesterServices.getSingleAcademicSemesterFromDB(
            semesterId
        );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic semester is retrieved successfully',
        data: result
    });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
        semesterId,
        req.body
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic semester is retrieved successfully',
        data: result
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester,
    updateAcademicSemester
};
