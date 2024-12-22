import catchAsync from '../../utils/catchAsync';

const createSemesterRegistration = catchAsync();

const getAllSemesterRegistrations = catchAsync();

const getSingleSemesterRegistration = catchAsync();

const updateSemesterRegistration = catchAsync();

const deleteSemesterRegistration = catchAsync();

export const SemesterRegistrationController = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration
};
