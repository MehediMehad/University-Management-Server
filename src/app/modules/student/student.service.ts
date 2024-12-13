/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    // {email: {$regex : query.searchTerm, $option: i}}
    // {presentAddress: {$regex : query.searchTerm, $option: i}}
    // {'name.firstName': {$regex : query.searchTerm, $option: i}}
    console.log('base', { query });

    const queryObj = { ...query };

    const studentSearchableFields = [
        'email',
        'name.firstName',
        'presentAddress'
    ];

    let searchTerm = '';
    if (query?.searchTerm) {
        searchTerm = query?.searchTerm as string;
    }
    const searchQuery = Student.find({
        $or: studentSearchableFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: 'i' }
        }))
    });
    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit'];

    excludeFields.forEach((el) => delete queryObj[el]);

    const filterQuery = searchQuery
        .find(queryObj)
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty'
            }
        });
    let sort = '-createdAt';
    if (query?.sort) {
        sort = query.sort as string;
    }
    const sortQuery = filterQuery.sort(sort);

    let limit = 1;
    if (query?.limit) {
        limit = query?.limit as number;
    }
    const limitQuery = await sortQuery.limit(limit);

    return limitQuery;
};
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;
    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData
    };
    /*
    guardian: {
      fatherOccupation:"Teacher"
    }

    guardian.fatherOccupation = Teacher

    name.firstName = 'Mehedi'
    name.lastName = 'Mehad'
  */
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }
    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }

    const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
        new: true,
        runValidators: true
    });

    return result;
};

const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id })
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty'
            }
        });
    return result;
};

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const deletedStudent = await Student.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );
        if (!deletedStudent) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to delete student'
            );
        }
        const deletedUser = await User.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session }
        );

        if (!deletedUser) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to delete user'
            );
        }
        await session.commitTransaction();
        await session.endSession();

        return deletedStudent;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(StatusCodes.BAD_REQUEST, err);
    }
};
export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    updateStudentIntoDB,
    deleteStudentFromDB
};
