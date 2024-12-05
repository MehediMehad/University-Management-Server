import { academicSemesterNameCodeMapper } from './academic.semester.const';
import { TAcademicSemester } from './academic.semester.interface';
import { AcademicSemester } from './academic.semester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid Semester Code');
    }

    const result = await AcademicSemester.create(payload);
    return result;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB
};
