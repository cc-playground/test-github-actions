const { DB_CONNECTION_URI, SERVER_PORT} = process.env;
const { TrainingRequestService } = require("./training-request-service")
const { Server } = require("./server")

if(DB_CONNECTION_URI === undefined || SERVER_PORT === undefined) {
    console.error('Necessary environment variables were not set!');
    process.exit(1);
}

(async function () {

    const pg = require('pg');
    const pool = new pg.Pool({ connectionString: DB_CONNECTION_URI });
    await pool.query('CREATE TABLE IF NOT EXISTS "training-requests" (id SERIAL PRIMARY KEY, name varchar(20))');

    const trainingRequestService = new TrainingRequestService(pool)
    const expressServer = new Server(trainingRequestService)

    expressServer.start(SERVER_PORT)

    process.on('SIGTERM', async () => {
        console.log('SIGTERM signal received');
        await pool.end();
        console.log('Pool ended');
        expressServer.stop();
    });
}());
