import express from 'express';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import validateRequest from '../../Middleware/validateRequest';

const router = express.Router();

router.post(
    '/create-course',
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse
);
router.get('/', CourseControllers.getAllCourses);
router.get('/:id', CourseControllers.getSingleCourse);
router.patch(
    '/:id',
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse
);
router.put(
    '/:courseId/assign-faculties',
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse
);

export const CourseRoutes = router;
