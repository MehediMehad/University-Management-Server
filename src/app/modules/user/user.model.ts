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
            required: true
        },
        needsPasswordChange: {
            type: Boolean,
            default: true
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
    return await User.findOne({ id }).select('isDeleted status password');
};

export const User = model<TUser, UserModel>('User', userSchema);
