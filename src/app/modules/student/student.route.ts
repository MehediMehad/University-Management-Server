import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../Middleware/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = express.Router();
const { getAllStudents, getSingleStudent, deleteStudent, updateStudent } =
    StudentControllers;

// will call controller func
router.get('/', getAllStudents);
router.get(
    '/:studentId',
    validateRequest(updateStudentValidationSchema),
    getSingleStudent
);
router.patch('/:studentId', updateStudent);
router.delete('/:studentId', deleteStudent);

export const StudentRoutes = router;
