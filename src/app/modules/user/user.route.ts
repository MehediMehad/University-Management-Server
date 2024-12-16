import express from 'express';
import { UserControllers } from './user.controller';
import { createsStudentValidationSchema } from '../student/student.validation';
import validateRequest from '../../Middleware/validateRequest';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
const router = express.Router();

router.post(
    '/create-student',
    validateRequest(createsStudentValidationSchema),
    UserControllers.createStudent
);
router.post(
    '/create-faculty',
    validateRequest(createFacultyValidationSchema),
    UserControllers.createFaculty
);

router.post(
    '/create-admin',
    validateRequest(createAdminValidationSchema),
    UserControllers.createAdmin
);

export const UserRouter = router;
