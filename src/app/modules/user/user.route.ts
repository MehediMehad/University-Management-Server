import express from 'express';
import { UserControllers } from './user.controller';
import { createsStudentValidationSchema } from '../student/student.validation';
import validateRequest from '../../Middleware/validateRequest';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from './user.constant';
const router = express.Router();

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    validateRequest(createsStudentValidationSchema),
    UserControllers.createStudent
);
router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),
    validateRequest(createFacultyValidationSchema),
    UserControllers.createFaculty
);

router.post(
    '/create-admin',
    // auth(USER_ROLE.admin), // TODO: Super Admin
    validateRequest(createAdminValidationSchema),
    UserControllers.createAdmin
);

export const UserRouter = router;
