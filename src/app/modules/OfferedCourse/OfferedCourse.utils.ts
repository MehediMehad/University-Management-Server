import { TSchedule } from './OfferedCourse.interface';

export const hasTimeConflict = (
    assignedSchedules: TSchedule[],
    newSchedule: TSchedule
) => {
    for (const schedule of assignedSchedules) {
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
            return true;
        }
    }
    return false;
};
