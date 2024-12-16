import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCoursefaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(
        Course.find().populate('preRequisiteCourses.course'),
        query
    )
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await courseQuery.modelQuery;
    return result;
};
const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate(
        'preRequisiteCourses.course'
    );
    return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // step1: basic course info update
        const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            courseRemainingData,
            {
                new: true,
                runValidators: true,
                session
            }
        );
        if (!updatedBasicCourseInfo) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Failed to update course'
            );
        }
        // check if there is any pre requisite courses to update
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // filter out the deleted fields
            const deletedRequisites = preRequisiteCourses
                .filter((el) => el.course && el.isDeleted)
                .map((el) => el.course);
            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: {
                            course: { $in: deletedRequisites }
                        }
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            );
            if (!deletedPreRequisiteCourses) {
                throw new AppError(
                    StatusCodes.BAD_REQUEST,
                    'Failed to update course'
                );
            }
            // filter out the new courses
            const newPreRequites = preRequisiteCourses?.filter(
                (el) => el.course && !el.isDeleted
            );

            const newPreRequitesCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        preRequisiteCourses: { $each: newPreRequites }
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            );
            if (!newPreRequitesCourses) {
                throw new AppError(
                    StatusCodes.BAD_REQUEST,
                    'Failed to update course'
                );
            }
        }

        await session.commitTransaction();
        await session.endSession();
        const result = await Course.findById(id).populate(
            'preRequisiteCourses.course'
        );

        return result;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update course');
    }
};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
    return result;
};
const assignFacultiesWithCourseIntoDB = async (
    id: string,
    payload: Partial<TCoursefaculty>
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } }
        },
        {
            upsert: true,
            new: true
        }
    );
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB
};
