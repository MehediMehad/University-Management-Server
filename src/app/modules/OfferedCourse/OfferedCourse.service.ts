import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { OfferedCourse } from './OfferedCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicDepartment,
        academicFaculty,
        course,
        faculty,
        section,
        days,
        startTime,
        endTime
    } = payload;

    // check if semesterRegistration id is exists
    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'Semester registration not found'
        );
    }
    const academicSemester = isSemesterRegistrationExists?.academicSemester;
    // check if academicDepartment id is exists
    const isAcademicFacultyExists =
        await AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Academic faculty not found');
    }
    // check if academicDepartment id is exists
    const isAcademicDepartmentExists =
        await AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'Academic department not found'
        );
    }
    // check if course id is exists
    const isCourseExists = await Course.findById(course);
    if (!isCourseExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Course not found');
    }
    // check if faculty id is exists
    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Faculty not found');
    }
    // check if the department is belongs to the faculty
    const isDepartmentBelongsToFaculty = await AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty
    });
    if (!isDepartmentBelongsToFaculty) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `This ${isAcademicDepartmentExists.name} department does not belong to ${isFacultyExists.name.firstName} ${isFacultyExists.name.middleName} faculty`
        );
    }
    // check if the same offered course same section in same semester is already exists
    const isOfferedCourseExists = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        faculty,
        section
    });
    if (isOfferedCourseExists) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            'Offered course with same section is already exists!'
        );
    }

    // get the schedule of the faculty
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select('days startTime endTime');

    // new schedule
    const newSchedule = {
        days,
        startTime,
        endTime
    };

    assignedSchedules.forEach((schedule) => {
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
        // check if the new schedule is overlapping with the existing schedule
        if (
            (newStartTime >= existingStartTime &&
                newStartTime <= existingEndTime) ||
            (newEndTime >= existingStartTime && newEndTime <= existingEndTime)
        ) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                `Faculty is already assigned in ${schedule.days} from ${schedule.startTime} to ${schedule.endTime}`
            );
        }
    });

    // const result = await OfferedCourse.create({ ...payload, academicSemester });
    // return result;
    return null;
};

export const OfferedCourseService = {
    createOfferedCourseIntoDB
};
