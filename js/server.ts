import express, { Application } from 'express';
import { TrainingRequestRouter } from './training-request-router';
import { OfferingsRouter } from './offerings-router';
import { default as pino, Logger} from 'pino';
import pinoExpress from 'express-pino-logger';

export class Server {

    private httpServer: import("http").Server
    private app: Application
    private logger: Logger = pino();

    constructor(trainingRequestRouter: TrainingRequestRouter, offeringsRouter: OfferingsRouter) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.static('ui/dist'))
        this.app.use(pinoExpress())
        this.app.use('/api/v1/offerings', offeringsRouter.router);
        this.app.use('/api/v1/requests', trainingRequestRouter.router);
    }
    
    public start(port: number): void {
        this.httpServer = this.app.listen(port, () => {
            this.logger.info('Server started on port %d', port);
        })
        .on('connection', function (socket) {
            socket.setTimeout(5 * 1000);
        })        
        .on('error', (error) => {
            this.logger.error(`Failed to start server at port %d, port might be in use.`, port)
            this.logger.error(error.stack);
            process.exit(2);
        });
    }
        
    public stop(): void {
        this.httpServer.close(() => {
            this.logger.info('Server shut down');
        });
    }
}