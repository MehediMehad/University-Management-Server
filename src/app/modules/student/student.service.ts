import { Student } from '../student.model';
import { TStudent } from './student.interface';

const createStudentIntoDB = async (studentData: TStudent) => {
    // const result = await Student.create(student); // built in method

    const student = new Student(studentData); // create an instance
    if (await student.isUserExists(studentData.id)) {
        throw new Error('User already exists');
    }

    const result = await student.save(); // built in instance method

    return result;
};

const getAllStudentsFromDB = async () => {
    const result = await Student.find();
    return result;
};
const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id });
    return result;
};
export const StudentServices = {
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB
};
