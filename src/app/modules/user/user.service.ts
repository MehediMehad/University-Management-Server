import config from '../../config';
import { AcademicSemester } from '../academicSemester/academic.semester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {};

    // if password is not given, user default password
    userData.password = password || (config.default_password as string);

    // set student role
    userData.role = 'student';
    // year semesterCode 4 digit number

    // find academic semester info
    const academicSemester = await AcademicSemester.findById(
        payload.admissionSemester
    );

    // create generate id
    userData.id = await generateStudentId(academicSemester);

    // create a user
    const newUser = await User.create(userData); // built in method

    if (Object.keys(newUser).length) {
        // set id , _id
        payload.id = newUser.id;
        payload.user = newUser._id; // reference _id

        const newStudent = await Student.create(payload);
        return newStudent;
    }
};

export const UserServices = {
    createStudentIntoDB
};
