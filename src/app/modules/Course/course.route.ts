import express from 'express';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import validateRequest from '../../Middleware/validateRequest';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/create-course',
    auth(USER_ROLE.admin),
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse
);
router.get('/', CourseControllers.getAllCourses);
router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseControllers.getSingleCourse
);
router.patch(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse
);
router.put(
    '/:courseId/assign-faculties',
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse
);
router.get(
    '/:courseId/get-faculties',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseControllers.getFacultiesWithCourse
);

router.delete(
    '/:courseId/remove-faculties',
    auth(USER_ROLE.admin),
    validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse
);

export const CourseRoutes = router;
