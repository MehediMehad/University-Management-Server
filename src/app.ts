import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/Middleware/globalErrorHandler';
import notFound from './app/Middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();
// const port = 3000;

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

// applications routs
app.use('/api/v1', router);
const test = async (req: Request, res: Response) => {
    Promise.reject();
    const a = 55;
    res.send({ a });
};

app.get('/', test);

// Error-handling middleware (should be defined to handle errors globally)
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
