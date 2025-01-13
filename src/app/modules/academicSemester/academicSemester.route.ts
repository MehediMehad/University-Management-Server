import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import auth from '../../Middleware/auth';
const router = express.Router();

router.post(
    '/create-academic-semester',
    auth('admin'),
    validateRequest(
        AcademicSemesterValidations.createAcademicSemesterValidationSchema
    ),
    AcademicSemesterControllers.createAcademicSemester
);

router.get(
    '/:semesterId',
    AcademicSemesterControllers.getSingleAcademicSemester
);

router.patch(
    '/:semesterId',
    validateRequest(
        AcademicSemesterValidations.updateAcademicSemesterValidationSchema
    ),
    AcademicSemesterControllers.updateAcademicSemester
);

router.get(
    '/',
    auth('admin'),
    AcademicSemesterControllers.getAllAcademicSemesters
);

export const AcademicSemesterRouters = router;
