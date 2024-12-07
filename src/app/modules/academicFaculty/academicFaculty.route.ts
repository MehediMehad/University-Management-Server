import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = express.Router();

router.post(
    '/create-academic-faculty',
    validateRequest(
        AcademicFacultyValidation.createAcademicFacultyValidationSchema
    ),
    AcademicFacultyControllers.createAcademicFaculty
);

export const AcademicFacultyRouters = router;
