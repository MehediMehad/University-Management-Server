import express from 'express';
import { OfferedCourseValidations } from './OfferedCourse.validation';
import validateRequest from '../../Middleware/validateRequest';
import { OfferedCourseControllers } from './OfferedCourse.controller';

const router = express.Router();

router.get('/', OfferedCourseControllers.getAllOfferedCourses);

router.get('/:id', OfferedCourseControllers.getSingleOfferedCourses);

router.post(
    '/create-offered-course',
    validateRequest(
        OfferedCourseValidations.createOfferedCourseValidationSchema
    ),
    OfferedCourseControllers.createOfferedCourse
);
router.patch(
    '/:id',
    validateRequest(
        OfferedCourseValidations.updateOfferedCourseValidationSchema
    ),
    OfferedCourseControllers.updateOfferedCourse
);
router.delete('/:id', OfferedCourseControllers.deleteOfferedCourseFromDB);

export const offeredCourseRoutes = router;
