import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { OfferedCourseService } from './OfferedCourse.service';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await OfferedCourseService.createOfferedCourseIntoDB(
        req?.body
    );
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Offered course created successfully',
        data: result
    });
});

const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
    const result = await OfferedCourseService.getAllOfferedCoursesFromDB(
        req.query
    );
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'All offered courses fetched successfully',
        data: result
    });
});

const getSingleOfferedCourses = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await OfferedCourseService.getSingleOfferedCourseFromDB(id);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'OfferedCourse fetched successfully',
            data: result
        });
    }
);

const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await OfferedCourseService.updateOfferedCourseIntoDB(
        id,
        req.body
    );
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'OfferedCourse updated successfully',
        data: result
    });
});

const deleteOfferedCourseFromDB = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await OfferedCourseService.deleteOfferedCourseFromDB(id);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'OfferedCourse deleted successfully',
            data: result
        });
    }
);

export const OfferedCourseControllers = {
    createOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourseFromDB,
    getAllOfferedCourses,
    getSingleOfferedCourses
};
