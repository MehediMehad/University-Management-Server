import express from 'express';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../Middleware/validateRequest';
import { AuthControllers } from './auth.controller';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser
);

router.post(
    '/change-password',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword
);

export const AuthRoutes = router;
