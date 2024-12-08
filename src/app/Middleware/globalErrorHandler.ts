// /* eslint-disable no-unused-vars */
// import { NextFunction, Request, Response } from 'express';
// import config from '../config';

// const globalErrorHandler = (
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     err: any,
//     req: Request,
//     res: Response,
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     next: NextFunction
// ) => {
//     const statusCode = err.statusCode || 500;

//     res.status(statusCode).json({
//         success: false,
//         message: err.message || 'Something went wrong!',
//         error: {
//             name: err.name || 'Error',
//             details: err.errors || {}
//         },
//         stack: config.node_env === 'production' ? null : err.stack
//     });
// };

// export default globalErrorHandler;
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err?.statusCode || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({
        success: false,
        message,
        error: err
    });
};

export default globalErrorHandler;
