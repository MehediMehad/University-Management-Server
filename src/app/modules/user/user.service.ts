/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {};

    // if password is not given, user default password
    userData.password = password || (config.default_password as string);

    // set student role
    userData.role = 'student';
    // year semesterCode 4 digit number

    // find academic semester info
    const academicSemester = await AcademicSemester.findById(
        payload.admissionSemester
    );

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // create generate id
        userData.id = await generateStudentId(academicSemester);

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session }); // built in method

        if (!newUser.length) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to create user'
            );
        }
        // set id , _id
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; // reference _id

        // create a user (transaction-2)
        const newStudent = await Student.create([payload], { session });
        if (!newStudent.length) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to create user'
            );
        }
        return newStudent;
        await session.commitTransaction();
        await session.endSession();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
    }
};

export const UserServices = {
    createStudentIntoDB
};
