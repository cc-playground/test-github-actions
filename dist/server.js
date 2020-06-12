"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
class Server {
    constructor(trainingRequestRouter, offeringsRouter) {
        this.app = express_1.default();
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('ui/dist'));
        this.app.use('/api/v1/offerings', offeringsRouter.router);
        this.app.use('/api/v1/requests', trainingRequestRouter.router);
    }
    start(port) {
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
    }
    ;
    stop() {
        this.httpServer.close(() => {
            console.log('Server shut down');
        });
    }
    ;
}
exports.Server = Server;
