import express, { Application } from 'express';
import { TrainingRequestRouter } from './training-request-router';
import { OfferingsRouter } from './offerings-router';

export class Server {

    private httpServer: import("http").Server
    private app: Application

    constructor(trainingRequestRouter: TrainingRequestRouter, offeringsRouter: OfferingsRouter) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.static('ui/dist'))
        this.app.use('/api/v1/offerings', offeringsRouter.router);
        this.app.use('/api/v1/requests', trainingRequestRouter.router);
    }
    
    public start(port: number): void {
        this.httpServer = this.app.listen(port, function () {
            console.log(`Server started on port ${port}`);
        })
        .on('connection', function (socket) {
            socket.setTimeout(5 * 1000);
        })        
        .on('error', function (error) {
            console.error(`Failed to start server at port ${port}, port might be in use.`);
            console.error(error.stack);
            process.exit(2);
        });
    };
        
    public stop(): void {
        this.httpServer.close(() => {
            console.log('Server shut down');
        });
    };
}