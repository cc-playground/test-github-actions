import express, { Application } from 'express';
import { TrainingRequestRouter } from './training-request-router';
import { OfferingsRouter } from './offerings-router';
import { Logger } from 'winston';

export class Server {

    private httpServer: import("http").Server
    private app: Application
    private logger: Logger

    constructor(trainingRequestRouter: TrainingRequestRouter, offeringsRouter: OfferingsRouter, parentLogger: Logger) {
        this.logger = parentLogger.child({module: this.constructor.name});
        this.logger.info('Construction of Server...');
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.static('ui/dist'))
        this.app.use('/api/v1/offerings', offeringsRouter.router);
        this.app.use('/api/v1/requests', trainingRequestRouter.router);
        this.logger.info('Construction of Server successful');
        this.logger.debug('I am a debug log');
    }
    
    public start(port: number): void {
        this.httpServer = this.app.listen(port, () => {
            this.logger.info('Server started on port %d', port);
        })
        .on('connection', function (socket) {
            socket.setTimeout(5 * 1000);
        })        
        .on('error', function (error) {
            console.error(`Failed to start server at port ${port}, port might be in use.`);
            console.error(error.stack);
            process.exit(2);
        });
    }
        
    public stop(): void {
        this.httpServer.close(() => {
            console.log('Server shut down');
        });
    }
}