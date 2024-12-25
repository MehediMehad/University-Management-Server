import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { OfferedCourse } from './OfferedCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { hasTimeConflict } from './OfferedCourse.utils';

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

    // check if the new schedule is overlapping with the existing schedule
    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            'This faculty is not available at this time! Choose another time or day'
        );
    } // hasTimeConflict condition ends

    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;
};

export const OfferedCourseService = {
    createOfferedCourseIntoDB
};

/* Conditions to check createOfferedCourse:
if (!isSemesterRegistrationExists)
if (!isAcademicFacultyExists)
if (!isAcademicDepartmentExists)
if (!isCourseExists)
if (!isFacultyExists)
if (!isDepartmentBelongsToFaculty)
if (isOfferedCourseExists)
if (hasTimeConflict(assignedSchedules, newSchedule))
*/
