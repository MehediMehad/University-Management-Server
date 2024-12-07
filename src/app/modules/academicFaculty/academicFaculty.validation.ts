import { z } from 'zod';

const createAcademicFacultyValidationSchema = z.object({
    name: z.string({
        invalid_type_error: 'Academic Faculty must be a string'
    })
});

const updateAcademicFacultyValidationSchema = z.object({
    name: z.string({
        invalid_type_error: 'Academic Faculty must be a string'
    })
});

export const AcademicFacultyValidation = {
    createAcademicFacultyValidationSchema,
    updateAcademicFacultyValidationSchema
};
