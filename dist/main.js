"use strict";
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
const { DB_CONNECTION_URI, SERVER_PORT } = process.env;
if (DB_CONNECTION_URI === undefined || SERVER_PORT === undefined) {
    console.error('Necessary environment variables were not set!');
    process.exit(1);
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool({ connectionString: DB_CONNECTION_URI });
        yield pool.query('CREATE TABLE IF NOT EXISTS "training-requests" (id SERIAL PRIMARY KEY, contact varchar(20), "offering-id" int)');
        const offeringsService = new offerings_service_1.OfferingsService();
        const trainingRequestService = new training_request_service_1.TrainingRequestService(pool);
        const offeringsRouter = new offerings_router_1.OfferingsRouter(offeringsService);
        const trainingRequestRouter = new training_request_router_1.TrainingRequestRouter(trainingRequestService, offeringsService);
        const expressServer = new server_1.Server(trainingRequestRouter, offeringsRouter);
        expressServer.start(Number.parseInt(SERVER_PORT, 10));
        process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
            console.log('SIGTERM signal received');
            yield pool.end();
            console.log('Pool ended');
            expressServer.stop();
        }));
    });
}());
