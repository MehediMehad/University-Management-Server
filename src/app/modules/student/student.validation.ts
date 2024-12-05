import { z } from 'zod';

const userNameValidationSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, 'First name is required.')
        .max(20, 'First Name cannot be more than 20 characters.')
        .refine(
            (value) => {
                const firstNameStr =
                    value.charAt(0).toUpperCase() +
                    value.slice(1).toLowerCase();
                return firstNameStr === value;
            },
            { message: 'First name must be in capitalized format.' }
        ),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(1, 'Last name is required.')
});

const guardianValidationSchema = z.object({
    fatherName: z.string().min(1, "Father's name is required."),
    fatherOccupation: z.string().min(1, "Father's occupation is required."),
    fatherContactNo: z.string().min(1, "Father's contact number is required."),
    motherName: z.string().min(1, "Mother's name is required."),
    motherOccupation: z.string().min(1, "Mother's occupation is required."),
    motherContactNo: z.string().min(1, "Mother's contact number is required.")
});

const localGuardianValidationSchema = z.object({
    name: z.string().trim().min(1, "Local guardian's name is required."),
    occupation: z.string().min(1, "Local guardian's occupation is required."),
    address: z.string().min(1, "Local guardian's address is required."),
    contactNo: z.string().min(1, "Local guardian's contactNo is required")
});

export const createsStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().min(1, 'Password is required.').max(20),
        student: z.object({
            name: userNameValidationSchema,
            gender: z.enum(['male', 'female', 'other'], {
                errorMap: () => ({ message: 'Invalid gender.' })
            }),
            dateOfBirth: z.string().min(1, 'Date of birth is required.'),
            email: z
                .string()
                .email('Invalid email format.')
                .min(1, 'Email is required.'),
            contactNo: z.string().min(1, 'Contact number is required.'),
            emergencyContactNo: z
                .string()
                .min(1, 'Emergency contact number is required.'),
            bloodGroup: z.enum(
                ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                {
                    errorMap: () => ({ message: 'Invalid blood group.' })
                }
            ),
            permanentAddress: z
                .string()
                .min(1, 'Permanent address is required.'),
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            profileImg: z
                .string()
                .url('Invalid profile image URL.')
                .min(1, 'Profile image URL is required.')
        })
    })
});
export const studentValidations = {
    studentValidationSchema: createsStudentValidationSchema
};
