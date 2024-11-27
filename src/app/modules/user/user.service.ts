import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    // create a user object
    const userData: Partial<TUser> = {};

    // if password is not given, user default password
    userData.password = password || (config.default_password as string);

    // set student role
    userData.role = 'student';

    // set manually create generate id
    userData.id = '024552201';

    // create a user
    const newUser = await User.create(userData); // built in method

    if (Object.keys(newUser).length) {
        // set id , _id
        studentData.id = newUser.id;
        studentData.user = newUser._id; // reference _id

        const newStudent = await Student.create(studentData);
        return newStudent;
    }
};

export const UserServices = {
    createStudentIntoDB
};
