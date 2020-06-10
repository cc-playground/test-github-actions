const { DB_CONNECTION_URI, SERVER_PORT} = process.env;
const { TrainingRequestService } = require("./training-request-service")
const { OfferingsService } = require("./offerings-service")
const { Server } = require("./server")
const { OfferingsRouter } = require('./offerings-router');
const { TrainingRequestRouter } = require('./training-request-router');

if(DB_CONNECTION_URI === undefined || SERVER_PORT === undefined) {
    console.error('Necessary environment variables were not set!');
    process.exit(1);
}

(async function () {

    const pg = require('pg');
    const pool = new pg.Pool({ connectionString: DB_CONNECTION_URI });
    await pool.query('CREATE TABLE IF NOT EXISTS "training-requests" (id SERIAL PRIMARY KEY, contact varchar(20), "offering-id" int)');

    const offeringsService = new OfferingsService()
    const trainingRequestService = new TrainingRequestService(pool)
    const offeringsRouter = new OfferingsRouter(offeringsService)
    const trainingRequestRouter = new TrainingRequestRouter(trainingRequestService, offeringsService)
    const expressServer = new Server(trainingRequestRouter, offeringsRouter)

    expressServer.start(SERVER_PORT)

    process.on('SIGTERM', async () => {
        console.log('SIGTERM signal received');
        await pool.end();
        console.log('Pool ended');
        expressServer.stop();
    });
}());
