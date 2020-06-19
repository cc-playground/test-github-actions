import { Pool } from 'pg';
import { TrainingRequestService } from "./training-request-service"
import { OfferingsService } from "./offerings-service"
import { Server } from "./server"
import { OfferingsRouter } from './offerings-router'
import { TrainingRequestRouter } from './training-request-router'
import {default as pino} from 'pino';

const { DB_CONNECTION_URI, SERVER_PORT} = process.env;

if(DB_CONNECTION_URI === undefined || SERVER_PORT === undefined) {
    console.error('Necessary environment variables were not set!');
    process.exit(1);
}

(async function () {

    const pool = new Pool({ connectionString: DB_CONNECTION_URI });
    await pool.query('CREATE TABLE IF NOT EXISTS "training-requests" (id SERIAL PRIMARY KEY, contact varchar(20), "offering-id" int)');

    const parentLogger = pino();
    parentLogger.info(`Parent logger instance created`);

    const offeringsService = new OfferingsService(pool, parentLogger)
    const trainingRequestService = new TrainingRequestService(pool, parentLogger)
    const offeringsRouter = new OfferingsRouter(offeringsService)
    const trainingRequestRouter = new TrainingRequestRouter(trainingRequestService, offeringsService)
    const expressServer = new Server(trainingRequestRouter, offeringsRouter)

    expressServer.start(Number.parseInt(SERVER_PORT, 10))

    process.on('SIGTERM', async () => {
        console.log('SIGTERM signal received');
        await pool.end();
        console.log('Pool ended');
        expressServer.stop();
    });
}());
