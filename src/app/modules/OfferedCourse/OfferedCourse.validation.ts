import { z } from 'zod';
import { Days } from './OfferedCourse.constant';

// schema for time in 24-hour format
const timeStringSchema = z.string().refine(
    (time) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time); // returns true if time is in 24-hour format
    },
    {
        message: 'Invalid time format, expected "HH:MM" in 24-hour format'
    }
);

const createOfferedCourseValidationSchema = z.object({
    body: z
        .object({
            semesterRegistration: z.string(),
            academicFaculty: z.string(),
            academicDepartment: z.string(),
            course: z.string(),
            faculty: z.string(),
            section: z.number(),
            maxCapacity: z.number(),
            days: z.array(z.enum([...Days] as [string, ...string[]])),
            startTime: timeStringSchema,
            endTime: timeStringSchema
        })
        .refine(
            (data) => {
                // startTime : 10:30 => 1970-01-01T10:10:30.000Z
                // endTime : 12:30 => 1970-01-01T12:12:30.000Z
                const start = new Date(`1970-01-01T${data.startTime}:00.000Z`);
                const end = new Date(`1970-01-01T${data.endTime}:00.000Z`);
                return start < end;
            },
            { message: 'Start time should be less than end time' }
        )
});
const updateOfferedCourseValidationSchema = z.object({
    body: z
        .object({
            faculty: z.string(),
            maxCapacity: z.number(),
            days: z.array(z.enum([...Days] as [string, ...string[]])),
            startTime: timeStringSchema,
            endTime: timeStringSchema
        })
        .refine(
            (data) => {
                // startTime : 10:30 => 1970-01-01T10:10:30.000Z
                // endTime : 12:30 => 1970-01-01T12:12:30.000Z
                const start = new Date(`1970-01-01T${data.startTime}:00.000Z`);
                const end = new Date(`1970-01-01T${data.endTime}:00.000Z`);
                return start < end;
            },
            { message: 'Start time should be less than end time' }
        )
});

export const OfferedCourseValidations = {
    createOfferedCourseValidationSchema,
    updateOfferedCourseValidationSchema
};
