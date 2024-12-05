import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
    AcademicSemesterCode,
    AcademicSemesterName,
    Months
} from './academicSemester.const';

const academicSemester = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            required: true,
            enum: AcademicSemesterName
        },
        year: {
            type: Date,
            required: true
        },
        code: {
            type: String,
            required: true,
            enum: AcademicSemesterCode
        },
        startMonth: {
            type: String,
            enum: Months
        },
        endMonth: {
            type: String,
            enum: Months
        }
    },
    {
        timestamps: true
    }
);

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemester
);
