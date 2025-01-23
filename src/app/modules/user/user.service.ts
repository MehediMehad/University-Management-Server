/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
    generateAdminId,
    generateFacultyId,
    generateStudentId
} from './user.utils';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { TFaculty } from '../Faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../Faculty/faculty.model';
import { Admin } from '../Admin/admin.model';
import { USER_ROLE } from './user.constant';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
    file: any,
    password: string,
    payload: TStudent
) => {
    // create a user object
    const userData: Partial<TUser> = {};

    // if password is not given, user default password
    userData.password = password || (config.default_password as string);

    // set student role & email
    userData.role = 'student';
    userData.email = payload.email;
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

        if (file) {
            const imageName = `${userData.id}${payload?.name?.firstName}`;
            const path = file?.path;

            //send image to cloudinary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.profileImg = secure_url as string;
        }

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
        // payload.profileImg = secure_url;

        // create a user (transaction-2)
        const newStudent = await Student.create([payload], { session });
        if (!newStudent.length) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to create user'
            );
        }
        await session.commitTransaction();
        await session.endSession();
        return newStudent;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(StatusCodes.BAD_REQUEST, err);
    }
};
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use default password
    userData.password = password || (config.default_password as string);

    //set faculty role & email
    userData.role = 'faculty';
    userData.email = payload.email;

    // find academic department info
    const academicDepartment = await AcademicDepartment.findById(
        payload.academicDepartment
    );

    if (!academicDepartment) {
        throw new AppError(400, 'Academic department not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateFacultyId();

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session }); // array

        //create a faculty
        if (!newUser.length) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to create user'
            );
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a faculty (transaction-2)

        const newFaculty = await Faculty.create([payload], { session });

        if (!newFaculty.length) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to create faculty'
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use default password
    userData.password = password || (config.default_password as string);

    //set admin role & email
    userData.role = 'admin';
    userData.email = payload.email;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateAdminId();

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session });

        //create a admin
        if (!newUser.length) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to create admin'
            );
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a admin (transaction-2)
        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to create admin'
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const getMe = async (userId: string, role: string) => {
    let result = null;
    if (role === USER_ROLE.student) {
        result = await Student.findOne({ id: userId }).populate('user');
    }
    if (role === USER_ROLE.admin) {
        result = await Admin.findOne({ id: userId }).populate('user');
    }
    if (role === USER_ROLE.faculty) {
        result = await Faculty.findOne({ id: userId }).populate('user');
    }
    return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, {
        new: true
    });
    return result;
};

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe,
    changeStatus
};
