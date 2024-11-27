import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();
const { getAllStudents, getSingleStudent, deleteStudent } = StudentControllers;

// will call controller func
router.get('/', getAllStudents);
router.get('/:studentId', getSingleStudent);
router.delete('/:studentId', deleteStudent);

export const StudentRoutes = router;
