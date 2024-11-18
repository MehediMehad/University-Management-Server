import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();
const { createStudent, getAllStudents } = StudentControllers;

// will call controller func
router.post('/create-student', createStudent);
router.get('/', getAllStudents);
router.get('/:studentId');

export const StudentRoutes = router;
