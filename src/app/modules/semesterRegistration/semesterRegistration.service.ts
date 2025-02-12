/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import { OfferedCourse } from '../OfferedCourse/OfferedCourse.model';
import mongoose from 'mongoose';

const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration
) => {
    const academicSemester = payload?.academicSemester;

    // check if there any registered semester that is already 'UPCOMING'|'ONGOING'
    const isThereAnyUpcomingOrOngoingSemester =
        await SemesterRegistration.findOne({
            $or: [
                { status: RegistrationStatus.UPCOMING },
                { status: RegistrationStatus.ONGOING }
            ]
        });

    if (isThereAnyUpcomingOrOngoingSemester) {
        // if there is any semester that is already 'UPCOMING'|'ONGOING'
        throw new AppError(
            StatusCodes.CONFLICT,
            `There is already a semester that is ${isThereAnyUpcomingOrOngoingSemester.status} registered semester !`
        );
    }

    //check if the academic semester exists
    const isAcademicSemesterExist =
        await AcademicSemester.findById(academicSemester);

    if (!isAcademicSemesterExist) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'Academic semester not found'
        );
    }
    //check if the academic semester is already registered
    const isSemesterRegistrationExist = await SemesterRegistration.findOne({
        academicSemester
    });
    if (isSemesterRegistrationExist) {
        throw new AppError(
            StatusCodes.CONFLICT,
            'This academic semester is already registered'
        );
    }
    // create semester registration
    const result = await SemesterRegistration.create(payload);
    return result;
};
const getAllSemesterRegistrationsFromDB = async (
    query: Record<string, unknown>
) => {
    const semesterRegistrationQuery = new QueryBuilder(
        SemesterRegistration.find().populate('academicSemester'),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await semesterRegistrationQuery.modelQuery;
    return result;
};
const getSingleSemesterRegistrationsFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id);
    return result;
};
const updateSemesterRegistrationIntoDB = async (
    id: string,
    payload: Partial<TSemesterRegistration>
) => {
    const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

    //check if the semester registration exists
    const currentSemesterStatus = isSemesterRegistrationExist?.status;
    const registeredSemesterStatus = payload?.status;
    if (!isSemesterRegistrationExist) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'Semester registration not found'
        );
    }

    // if the registered semester registration is ENDED, we wil not allow to update it
    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'This semester registration is already ENDED'
        );
    }
    // UPCOMING -> ONGOING -> ENDED
    if (
        currentSemesterStatus === RegistrationStatus.UPCOMING &&
        registeredSemesterStatus === RegistrationStatus.ENDED
    ) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'You can not directly update the status to ENDED from UPCOMING'
        );
    }

    if (
        currentSemesterStatus === RegistrationStatus.ONGOING &&
        registeredSemesterStatus === RegistrationStatus.UPCOMING
    ) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'You can not directly update the status to UPCOMING from ONGOING'
        );
    }
    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true, // return the updated document
        runValidators: true // check data validation
    });
    return result;
};
const deleteSemesterRegistrationFromDB = async (id: string) => {
    /** 
    * Step1: Delete associated offered courses.
    * Step2: Delete semester registration when the status is 
    'UPCOMING'.
    **/

    // checking if the semester registration is exist
    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(id);

    if (!isSemesterRegistrationExists) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'This registered semester is not found !'
        );
    }

    // checking if the status is still "UPCOMING"
    const semesterRegistrationStatus = isSemesterRegistrationExists.status;

    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `You can not update as the registered semester is ${semesterRegistrationStatus}`
        );
    }

    const session = await mongoose.startSession();

    //deleting associated offered courses

    try {
        session.startTransaction();

        const deletedOfferedCourse = await OfferedCourse.deleteMany(
            {
                semesterRegistration: id
            },
            {
                session
            }
        );

        if (!deletedOfferedCourse) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to delete semester registration !'
            );
        }

        const deletedSemesterRegistration =
            await SemesterRegistration.findByIdAndDelete(id, {
                session,
                new: true
            });

        if (!deletedSemesterRegistration) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to delete semester registration !'
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return null;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to delete semester registration ! ${err.message}`
        );
    }
};

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationsFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
};
