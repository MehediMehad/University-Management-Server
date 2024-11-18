import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();
const { createStudent } = StudentControllers;

// will call controller func
router.post('/create-student', createStudent);

export const StudentRoutes = router;
