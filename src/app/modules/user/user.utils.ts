import { TAcademicSemester } from '../academicSemester/academic.semester.interface';
import { User } from './user.model';

export const findLastStudentId = async () => {
    const lastStudent = await User.findOne(
        {
            role: 'student'
        },
        {
            id: 1,
            _id: 0
        }
    )
        .sort({ createdAt: -1 })
        .lean();
    return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester | null) => {
    if (!payload) {
        throw new Error('Invalid academic semester data.');
    }
    let currentId = (0).toString(); // by default id 0000
    const lastStudentId = await findLastStudentId(); //* id: 2030010001

    const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
    const lastStudentYear = lastStudentId?.substring(0, 4); // 2030
    const currentSemesterCode = payload.code;
    const currentYear = payload.year;

    if (
        lastStudentId &&
        lastStudentSemesterCode === currentSemesterCode &&
        lastStudentYear === currentYear
    ) {
        currentId = lastStudentId.substring(6);
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

    incrementId = `${payload.year}${payload.code}${incrementId}`;

    return incrementId;
};
