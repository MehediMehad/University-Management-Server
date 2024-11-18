import { Request, Response } from 'express';
import { StudentServices } from './student.service';
const { createStudentIntoDB } = StudentServices;

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;
        console.log(studentData);

        const result = await createStudentIntoDB(studentData);

        res.status(200).json({
            success: true,
            message: 'Student is created successfully',
            data: result
        });
    } catch (err) {
        console.log(err);
    }
};

export const StudentControllers = {
    createStudent
};
