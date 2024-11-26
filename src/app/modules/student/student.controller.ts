/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import studentValidationSchema from './student.zod.validation';
// import studentValidationSchema from './student.validation';
const { createStudentIntoDB, getAllStudentsFromDB, getSingleStudentFromDB } =
    StudentServices;

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;
        // data validation using jai
        // const { error, value } = studentValidationSchema.validate(studentData);

        //  create a schema validation using zod

        const zodParsedData = studentValidationSchema.parse(studentData);

        const result = await createStudentIntoDB(zodParsedData);
        // if (error) {
        //     res.status(500).json({
        //         success: false,
        //         message: 'something went wrong',
        //         error: error.details
        //     });
        // }
        res.status(200).json({
            success: true,
            message: 'Student is created successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err
        });
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
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err
        });
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
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err
        });
    }
};

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.deleteStudentFromDB(studentId);

        res.status(200).json({
            success: true,
            message: 'Student is deleted successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'something went wrong',
            error: err
        });
    }
};

export const StudentControllers = {
    createStudent,
    getAllStudents,
    getSingleStudent,
    deleteStudent
};
