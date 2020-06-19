"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const pino_1 = __importDefault(require("pino"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
class Server {
    constructor(trainingRequestRouter, offeringsRouter) {
        this.logger = pino_1.default();
        this.app = express_1.default();
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('ui/dist'));
        this.app.use(express_pino_logger_1.default());
        this.app.use('/api/v1/offerings', offeringsRouter.router);
        this.app.use('/api/v1/requests', trainingRequestRouter.router);
    }
    start(port) {
        this.httpServer = this.app.listen(port, () => {
            this.logger.info('Server started on port %d', port);
        })
            .on('connection', function (socket) {
            socket.setTimeout(5 * 1000);
        })
            .on('error', (error) => {
            this.logger.error(`Failed to start server at port %d, port might be in use.`, port);
            this.logger.error(error.stack);
            process.exit(2);
        });
    }
    stop() {
        this.httpServer.close(() => {
            this.logger.info('Server shut down');
        });
    }
}
exports.Server = Server;
