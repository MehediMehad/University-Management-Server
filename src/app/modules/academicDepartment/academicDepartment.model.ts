import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicFaculty'
        }
    },
    {
        timestamps: true
    }
);

// Pre-save middleware to check if the department already exists
academicDepartmentSchema.pre('save', async function (next) {
    const isDepartmentExist = await AcademicDepartment.findOne({
        name: this.name
    });
    if (isDepartmentExist) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'This department is already exist!'
        );
    }
    next();
});

// Pre-findOneAndUpdate middleware to check if the department exists
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery();
    const isDepartmentExist = await AcademicDepartment.findOne(query);

    if (!isDepartmentExist) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'This department dose not exists!'
        );
    }
    next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
    'AcademicDepartment',
    academicDepartmentSchema
);
