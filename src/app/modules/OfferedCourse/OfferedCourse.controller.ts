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

export const OfferedCourseControllers = {
    createOfferedCourse
};
