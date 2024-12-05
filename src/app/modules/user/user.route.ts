import express from 'express';
import { UserControllers } from './user.controller';
import { createsStudentValidationSchema } from '../student/student.validation';
import validateRequest from '../../Middleware/validateRequest';
const router = express.Router();

router.post(
    '/create-student',
    validateRequest(createsStudentValidationSchema),
    UserControllers.createStudent
);

export const UserRouter = router;
