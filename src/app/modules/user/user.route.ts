import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { createsStudentValidationSchema } from '../student/student.validation';
import validateRequest from '../../Middleware/validateRequest';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';
const router = express.Router();

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
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
router.post(
    '/change-status/:id',
    auth(USER_ROLE.admin),
    validateRequest(UserValidation.changeStatusValidationSchema),
    UserControllers.changeStatus
);

router.get(
    '/me',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    UserControllers.getMe
);

export const UserRouter = router;
