import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: 0
        },
        needsPasswordChange: {
            type: Boolean,
            default: true
        },
        passwordChangeAt: {
            type: Date
        },
        role: {
            type: String,
            enum: ['admin', 'student', 'faculty']
        },
        status: {
            type: String,
            enum: ['in-progress', 'blocked'],
            default: 'in-progress'
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    );
    next();
});

// set "" after saving password
userSchema.post('save', async function (doc, next) {
    doc.password = '';
    next();
});

userSchema.statics.isUserExistByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashPassword
) {
    return await bcrypt.compare(
        plainTextPassword, // password from the request "Plain Text Password"
        hashPassword // password from the database "Hashed Password"
    );
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp,
    jwtJWTIssuedTimestamp
) {
    // Convert jwtJWTIssuedTimestamp (UNIX timestamp) to a Date object
    const jwtIssuedDate = new Date(jwtJWTIssuedTimestamp * 1000); // Convert to milliseconds

    // Compare the two timestamps
    return passwordChangedTimestamp > jwtIssuedDate;
};

export const User = model<TUser, UserModel>('User', userSchema);
