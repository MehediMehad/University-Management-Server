import { Request, Response } from 'express';
import { StudentServices } from './student.service';
const { createStudentIntoDB, getAllStudentsFromDB, getSingleStudentFromDB } =
    StudentServices;

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;
        const result = await createStudentIntoDB(studentData);

        res.status(200).json({
            success: true,
            message: 'Student is created successfully',
            data: result
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};

const getAllStudents = async (rsq: Request, res: Response) => {
    try {
        const result = await getAllStudentsFromDB();

        res.status(200).json({
            success: true,
            message: 'Students are retrieved successfully',
            data: result
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};
const getSingleStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const result = await getSingleStudentFromDB(studentId);

        res.status(200).json({
            success: true,
            message: 'Students are retrieved successfully',
            data: result
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};

export const StudentControllers = {
    createStudent,
    getAllStudents,
    getSingleStudent
};
