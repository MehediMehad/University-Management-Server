import { Schema, model } from 'mongoose';
// import validator from 'validator';
import {
    TGuardian,
    TLocalGuardian,
    TStudent,
    StudentMethods,
    StudentModel,
    TStudentName
} from './student/student.interface';

const userNameSchema = new Schema<TStudentName>({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required.'],
        maxlength: [20, 'First Name can not be more than 20 characters'],
        validate: {
            validator: function (value: string): boolean {
                const firstNameStr: string =
                    value.charAt(0).toUpperCase() +
                    value.slice(1).toLowerCase();
                return firstNameStr === value;
            },
            message: '{VALUE} is not in capitalize formate'
        }
    },
    middleName: {
        type: String,
        trim: true,
        required: false
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required.']

        // TODO: Error
        // validate: {
        //     validator: (value: string) => validator.isAlphanumeric(value),
        //     message: '{VALUE} is not valid'
        // }
    }
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: {
        type: String,
        required: [true, "Father's name is required."]
    },
    fatherOccupation: {
        type: String,
        required: [true, "Father's occupation is required."]
    },
    fatherContactNo: {
        type: String,
        required: [true, "Father's contact number is required."]
    },
    motherName: {
        type: String,
        required: [true, "Mother's name is required."]
    },
    motherOccupation: {
        type: String,
        required: [true, "Mother's occupation is required."]
    },
    motherContactNo: {
        type: String,
        required: [true, "Mother's contact number is required."]
    }
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: {
        type: String,
        trim: true,
        required: [true, "Local guardian's name is required."]
    },
    occupation: {
        type: String,
        required: [true, "Local guardian's occupation is required."]
    },
    address: {
        type: String,
        required: [true, "Local guardian's address is required."]
    }
});

// 2. Create a Schema corresponding to the document interface.
const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>({
    id: {
        type: String,
        required: [true, 'Student ID is required.'],
        unique: true
    },
    name: {
        type: userNameSchema,
        required: [true, 'Student name is required.']
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not a valid gender.'
        },
        required: [true, 'Gender is required.']
    },
    dateOfBirth: {
        type: String,
        required: [true, 'Date of birth is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true
    },
    contactNo: {
        type: String,
        required: [true, 'Contact number is required.']
    },
    emergencyContactNo: {
        type: String,
        required: [true, 'Emergency contact number is required.']
    },
    bloodGroup: {
        type: String,
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: '{VALUE} is not a valid blood group.'
        },
        required: [true, 'Blood group is required.']
    },
    permanentAddress: {
        type: String,
        required: [true, 'Permanent address is required.']
    },
    guardian: {
        type: guardianSchema,
        required: [true, 'Guardian information is required.']
    },
    localGuardian: {
        type: localGuardianSchema,
        required: [true, 'Local guardian information is required.']
    },
    profileImg: {
        type: String,
        required: [true, 'Profile image URL is required.']
    },
    isActive: {
        type: String,
        enum: {
            values: ['active', 'blocked'],
            message: '{VALUE} is not a valid status.'
        },
        default: 'active'
    }
});

studentSchema.methods.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id });
    return existingUser;
};
export const Student = model<TStudent, StudentModel>('Student', studentSchema);

// include appropriate errors massage (Chat GPT Generate )
