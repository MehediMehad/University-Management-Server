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

router.delete('/:id', CourseControllers.deleteCourse);

export const CourseRoutes = router;
