"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const training_request_service_1 = require("./training-request-service");
const offerings_service_1 = require("./offerings-service");
const server_1 = require("./server");
const offerings_router_1 = require("./offerings-router");
const training_request_router_1 = require("./training-request-router");
const winston_1 = __importStar(require("winston"));
const { DB_CONNECTION_URI, SERVER_PORT } = process.env;
if (DB_CONNECTION_URI === undefined || SERVER_PORT === undefined) {
    console.error('Necessary environment variables were not set!');
    process.exit(1);
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const { combine, label, printf } = winston_1.format;
        const myFormat = printf(({ level, message, label, when }) => {
            return `${when} [${label}] ${level}: ${message}`;
        });
        const pool = new pg_1.Pool({ connectionString: DB_CONNECTION_URI });
        yield pool.query('CREATE TABLE IF NOT EXISTS "training-requests" (id SERIAL PRIMARY KEY, contact varchar(20), "offering-id" int)');
        const logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.prettyPrint(),
            transports: [
                new winston_1.default.transports.Console({ format: winston_1.default.format.combine(winston_1.default.format.splat(), winston_1.default.format.colorize(), winston_1.default.format.simple(), label({ label: 'custom label' }), winston_1.default.format.timestamp({ alias: 'when' }), myFormat) })
            ]
        });
        const offeringsService = new offerings_service_1.OfferingsService();
        const trainingRequestService = new training_request_service_1.TrainingRequestService(pool);
        const offeringsRouter = new offerings_router_1.OfferingsRouter(offeringsService);
        const trainingRequestRouter = new training_request_router_1.TrainingRequestRouter(trainingRequestService, offeringsService);
        const expressServer = new server_1.Server(trainingRequestRouter, offeringsRouter, logger);
        expressServer.start(Number.parseInt(SERVER_PORT, 10));
        process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
            console.log('SIGTERM signal received');
            yield pool.end();
            console.log('Pool ended');
            expressServer.stop();
        }));
    });
}());
