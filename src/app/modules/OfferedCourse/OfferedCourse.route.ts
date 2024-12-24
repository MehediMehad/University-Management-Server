import express from 'express';
import { OfferedCourseValidations } from './OfferedCourse.validation';
import validateRequest from '../../Middleware/validateRequest';
import { OfferedCourseControllers } from './OfferedCourse.controller';

const router = express.Router();

router.post(
    '/create-offered-course',
    validateRequest(
        OfferedCourseValidations.createOfferedCourseValidationSchema
    ),
    OfferedCourseControllers.createOfferedCourse
);

export const offeredCourseRoutes = router;
