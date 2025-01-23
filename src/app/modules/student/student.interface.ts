import { Model, Types } from 'mongoose';

export type TStudentName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export type TGuardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
};

export type TLocalGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
};

// 1. Create an interface representing a document in MongoDB.

export type TStudent = {
    id: string;
    user: Types.ObjectId;
    name: TStudentName;
    password: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress?: string;
    permanentAddress: string;
    guardian: TGuardian;
    localGuardian: TLocalGuardian;
    profileImg?: string;
    admissionSemester: Types.ObjectId;
    isDeleted?: boolean | null | undefined;
    academicDepartment: Types.ObjectId;
    // academicFaculty: Types.ObjectId;
};

// for crating static
export interface StudentModel extends Model<TStudent> {
    isUserExists(id: string): Promise<TStudent | null>;
}

//* for crating instance
// export type StudentMethods = {
//     isUserExists(id: string): Promise<TStudent | null>;
// };

// export type StudentModel = Model<
//     TStudent,
//     Record<string, never>,
//     StudentMethods
// >;
