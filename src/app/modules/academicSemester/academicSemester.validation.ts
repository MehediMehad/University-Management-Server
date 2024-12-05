import { z } from 'zod';

const academicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum
    })
});

export const AcademicSemesterValidation = {
    academicSemesterValidationSchema
};
