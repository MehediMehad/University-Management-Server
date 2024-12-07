import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.createAcademicDepartmentIntoDB(
            req.body
        );
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic department is created successfully!',
        data: result
    });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic departments is created successfully!',
        data: result
    });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result =
        await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
            departmentId
        );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic department is retrieved successfully',
        data: result
    });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result =
        await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
            departmentId,
            req.body
        );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Academic department is updated successfully',
        data: result
    });
});

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment
};
