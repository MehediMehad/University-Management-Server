import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();
const { createStudent, getAllStudents, getSingleStudent } = StudentControllers;

// will call controller func
router.post('/create-student', createStudent);
router.get('/', getAllStudents);
router.get('/:studentId', getSingleStudent);

export const StudentRoutes = router;
