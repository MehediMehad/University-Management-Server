import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
    AcademicSemesterCode,
    AcademicSemesterName,
    Months
} from './academicSemester.const';

const academicSemesterSchema = new Schema<TAcademicSemester>(
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

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        year: this.year,
        name: this.name
    });
    if (isSemesterExists) {
        throw new Error('Semester is already exists');
    }
});

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemesterSchema
);
