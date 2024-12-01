import { Schema, model } from 'mongoose';
// import validator from 'validator';
import {
    TGuardian,
    TLocalGuardian,
    TStudent,
    StudentModel,
    TStudentName
} from './student.interface';

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
const studentSchema = new Schema<TStudent, StudentModel>(
    {
        id: {
            type: String,
            required: [true, 'Student ID is required.'],
            unique: true
        },
        user: {
            type: Schema.Types.ObjectId,
            required: [true, 'User id is required'],
            unique: true,
            ref: 'User'
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
        isDeleted: {
            type: Boolean,
            default: false,
            validate: {
                validator: function (value) {
                    return (
                        value === null ||
                        value === undefined ||
                        typeof value === 'boolean'
                    );
                },
                message: 'isDeleted must be a boolean or null or undefined'
            }
        }
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

// virtual
studentSchema.virtual('fullName').get(function () {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// Query Middleware
studentSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

studentSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

studentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

// creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id });
    return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
