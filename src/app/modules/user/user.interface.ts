/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
    id: string;
    password: string;
    needsPasswordChange: boolean;
    passwordChangeAt?: Date;
    role: 'admin' | 'student' | 'faculty';
    status: 'in-progress' | 'blocked';
    isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
    // custom methods here
    isUserExistByCustomId: (id: string) => Promise<TUser | null>;
    isPasswordMatched: (
        plainTextPassword: string,
        hashPassword: string
    ) => Promise<boolean>;
    isJWTIssuedBeforePasswordChanged: (
        passwordChangedTimestamp: Date,
        jwtJWTIssuedTimestamp: number
    ) => boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
