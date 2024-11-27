import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRouter } from './app/modules/user/user.route';
const app: Application = express();
// const port = 3000;

//parsers
app.use(express.json());
app.use(cors());

// applications routs
app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRouter);

const getAController = (req: Request, res: Response) => {
    const a = 55;
    res.send({ a });
};

app.get('/', getAController);

export default app;
