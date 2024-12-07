import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRouter } from '../modules/user/user.route';
import { AcademicSemesterRouters } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRouters } from '../modules/academicFaculty/academicFaculty.route';

const router = Router();

const modulesRouter = [
    {
        path: '/users',
        route: UserRouter
    },
    {
        path: '/students',
        route: StudentRoutes
    },
    {
        path: '/academic-semester',
        route: AcademicSemesterRouters
    },
    {
        path: '/academic-faculty',
        route: AcademicFacultyRouters
    }
];

modulesRouter.forEach((route) => router.use(route.path, route.route));

export default router;
