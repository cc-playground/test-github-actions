import { Pool } from 'pg';
import { TrainingRequestService } from "./training-request-service"
import { OfferingsService } from "./offerings-service"
import { Server } from "./server"
import { OfferingsRouter } from './offerings-router'
import { TrainingRequestRouter } from './training-request-router'
import winston, {Logger, transports, format} from 'winston';


const { DB_CONNECTION_URI, SERVER_PORT} = process.env;

if(DB_CONNECTION_URI === undefined || SERVER_PORT === undefined) {
    console.error('Necessary environment variables were not set!');
    process.exit(1);
}

(async function () {
    const { combine, label, printf } = format;
    const myFormat = printf(({ level, message, label, when }) => {
        return `${when} [${label}] ${level}: ${message}`;
      });

    const pool = new Pool({ connectionString: DB_CONNECTION_URI });
    await pool.query('CREATE TABLE IF NOT EXISTS "training-requests" (id SERIAL PRIMARY KEY, contact varchar(20), "offering-id" int)');

    const logger = winston.createLogger({
        level: 'info',                          //Log only if info.level less than or equal to this level
        format: winston.format.prettyPrint(),
        transports: [
            new winston.transports.Console({format: winston.format.combine(
                winston.format.splat(),
                winston.format.colorize(),
                winston.format.simple(),
                label({ label: 'custom label'}),
                winston.format.timestamp({alias: 'when'}),
                myFormat
            )})
        ]
    });

    const offeringsService = new OfferingsService()
    const trainingRequestService = new TrainingRequestService(pool)
    const offeringsRouter = new OfferingsRouter(offeringsService)
    const trainingRequestRouter = new TrainingRequestRouter(trainingRequestService, offeringsService)
    const expressServer = new Server(trainingRequestRouter, offeringsRouter, logger)

    expressServer.start(Number.parseInt(SERVER_PORT, 10))

    process.on('SIGTERM', async () => {
        console.log('SIGTERM signal received');
        await pool.end();
        console.log('Pool ended');
        expressServer.stop();
    });
}());
