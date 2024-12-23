import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();
router.post(
    '/create-semester-registration',
    validateRequest(
        SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
    ),
    SemesterRegistrationController.createSemesterRegistration
);
router.get(
    '/:id',
    SemesterRegistrationController.getSingleSemesterRegistration
);
router.patch(
    '/:id',
    validateRequest(
        SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema
    ),
    SemesterRegistrationController.updateSemesterRegistration
);

router.delete(
    '/:id',
    SemesterRegistrationController.deleteSemesterRegistration
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

export const semesterRegistrationRoutes = router;
