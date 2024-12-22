import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationService } from './semesterRegistration.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await SemesterRegistrationService.createSemesterRegistrationIntoDB(
                req.body
            );

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Semester Registration is created successfully!',
            data: result
        });
    }
);

const getAllSemesterRegistrations = catchAsync(
    async (req: Request, res: Response) => {
        // sendResponse(res, {
        //   statusCode: StatusCodes.OK,
        //   success: true,
        //   message: '',
        //   data: result,
        // });
    }
);

const getSingleSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        // sendResponse(res, {
        //   statusCode: StatusCodes.OK,
        //   success: true,
        //   message: '',
        //   data: result,
        // });
    }
);

const updateSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        // sendResponse(res, {
        //   statusCode: StatusCodes.OK,
        //   success: true,
        //   message: '',
        //   data: result,
        // });
    }
);

const deleteSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        // sendResponse(res, {
        //   statusCode: StatusCodes.OK,
        //   success: true,
        //   message: '',
        //   data: result,
        // });
    }
);

export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration
};
