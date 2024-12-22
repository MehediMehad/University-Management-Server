import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';

const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration
) => {
    const academicSemester = payload?.academicSemester;

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
};
const getAllSemesterRegistrationsFromDB = async () => {};
const getSingleSemesterRegistrationsFromDB = async () => {};
const updateSemesterRegistrationIntoDB = async () => {};
const deleteSemesterRegistrationFromDB = async () => {};

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationsFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
};
