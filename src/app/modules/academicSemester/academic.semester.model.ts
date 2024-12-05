import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academic.semester.interface';
import {
    AcademicSemesterCode,
    AcademicSemesterName,
    Months
} from './academic.semester.const';

const academicSemester = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            required: true,
            enum: AcademicSemesterName
        },
        year: {
            type: String,
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
