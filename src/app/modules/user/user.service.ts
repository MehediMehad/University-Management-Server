import config from '../../config';
import { TStudent } from '../student/student.interface';
import { NewUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    // create a user object
    const user: NewUser = {};

    // if password is not given, user default password
    user.password = password || (config.default_password as string);

    // set student role
    user.role = 'student';

    // set manually create generate id
    user.id = '024552201';

    // create a user

    const result = await User.create(user); // built in method

    if (Object.keys(result).length) {
        // set id , _id
        studentData.id = result.id;
        studentData.user = result._id;
    }
    return result;
};

export const UserServices = {
    createStudentIntoDB
};
