import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course is created Successfully',
        data: result
    });
});

const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course are retrieved successfully',
        data: result
    });
});

const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingleCourseFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course is retrieved successfully',
        data: result
    });
});

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course is update successfully',
        data: result
    });
});

const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Course is deleted Successfully',
        data: result
    });
});
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;

    const result = await CourseServices.assignFacultiesWithCourseIntoDB(
        courseId,
        faculties
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculties assigned  successfully',
        data: result
    });
});

const getFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;

    const result = await CourseServices.getFacultiesWithCourseFromDB(courseId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculties retrieved successfully',
        data: result
    });
});
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;

    const result = await CourseServices.removeFacultiesFromCourseFromDB(
        courseId,
        faculties
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Faculties removed  successfully',
        data: result
    });
});
export const CourseControllers = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    deleteCourse,
    updateCourse,
    assignFacultiesWithCourse,
    getFacultiesWithCourse,
    removeFacultiesFromCourse
};
