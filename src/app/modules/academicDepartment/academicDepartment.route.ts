import express from 'express';
// import validateRequest from '../../Middleware/validateRequest';
// import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);
router.post(
    '/create-academic-department',
    validateRequest(
        AcademicDepartmentValidation.createAcademicDepartmentValidationSchema
    ),
    AcademicDepartmentControllers.createAcademicDepartment
);

router.get(
    '/:departmentId',
    AcademicDepartmentControllers.getSingleAcademicDepartment
);
router.patch(
    '/:departmentId',
    // validateRequest(
    //     AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema
    // ),
    AcademicDepartmentControllers.updateAcademicDepartment
);

export const AcademicDepartmentRouters = router;
