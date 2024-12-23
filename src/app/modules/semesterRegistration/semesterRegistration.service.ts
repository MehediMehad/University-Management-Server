import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration
) => {
    const academicSemester = payload?.academicSemester;

    // check if there any registered semester that is already 'UPCOMING'|'ONGOING'
    const isThereAnyUpcomingOrOngoingSemester =
        await SemesterRegistration.findOne({
            $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }]
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
const updateSemesterRegistrationIntoDB = async () => {};
const deleteSemesterRegistrationFromDB = async () => {};

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationsFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
};
