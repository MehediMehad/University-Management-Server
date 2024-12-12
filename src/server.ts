import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'http';

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        server = app.listen(config.port, () => {
            // eslint-disable-next-line no-console
            console.log(`Example app listening on port ${config.port}`);
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
}

main();

process.on('unhandledRejection', () => {
    console.log(`👹 unhandledRejection is detected, shutting down ...`);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on('uncaughtException', () => {
    console.log(`👹 uncaughtException is detected, shutting down ...`);
    process.exit(1);
});
