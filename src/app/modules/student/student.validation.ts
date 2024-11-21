import Joi from 'joi';

const userNameValidationSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .required()
        .max(20)
        .regex(/^[A-Z][a-z]*$/, '{#label} is not in capitalize format'),
    middleName: Joi.string().trim().optional(),
    lastName: Joi.string().trim().required()
    // Uncomment if using validator package for alphanumeric validation
    // .alphanum()
});

const guardianValidationSchema = Joi.object({
    fatherName: Joi.string().required().label("Father's name"),
    fatherOccupation: Joi.string().required().label("Father's occupation"),
    fatherContactNo: Joi.string().required().label("Father's contact number"),
    motherName: Joi.string().required().label("Mother's name"),
    motherOccupation: Joi.string().required().label("Mother's occupation"),
    motherContactNo: Joi.string().required().label("Mother's contact number")
});

const localGuardianValidationSchema = Joi.object({
    name: Joi.string().trim().required().label("Local guardian's name"),
    occupation: Joi.string().required().label("Local guardian's occupation"),
    address: Joi.string().required().label("Local guardian's address")
});

const studentValidationSchema = Joi.object({
    id: Joi.string().required().label('Student ID'),
    name: userNameValidationSchema.required().label('Student name'),
    gender: Joi.string()
        .valid('male', 'female', 'other')
        .required()
        .label('Gender'),
    dateOfBirth: Joi.string().required().label('Date of birth'),
    email: Joi.string().email().required().label('Email'),
    contactNo: Joi.string().required().label('Contact number'),
    emergencyContactNo: Joi.string()
        .required()
        .label('Emergency contact number'),
    bloodGroup: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .required()
        .label('Blood group'),
    permanentAddress: Joi.string().required().label('Permanent address'),
    guardian: guardianValidationSchema.required().label('Guardian information'),
    localGuardian: localGuardianValidationSchema
        .required()
        .label('Local guardian information'),
    profileImg: Joi.string().uri().required().label('Profile image URL'),
    isActive: Joi.string()
        .valid('active', 'blocked')
        .default('active')
        .label('Status')
});

export default studentValidationSchema;
