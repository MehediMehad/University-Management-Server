import express from 'express';
import { AcademicSemesterControllers } from './academic.semester.controller';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicSemesterValidations } from './academic.semester.validation';
const router = express.Router();

router.post(
    '/create-academic-semester',
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

router.get('/', AcademicSemesterControllers.getAllAcademicSemesters);

export const AcademicSemesterRouters = router;
