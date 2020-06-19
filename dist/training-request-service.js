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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingRequestService = void 0;
const pg_query_stream_1 = __importDefault(require("pg-query-stream"));
class TrainingRequestService {
    constructor(pool, parentLogger) {
        this.pool = pool;
        this.logger = parentLogger.child({ module: this.constructor.name });
        this.logger.info('created child logger');
    }
    getAllStreamTo(writeableStream) {
        this.logger.info('querying database');
        this.pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            const query = new pg_query_stream_1.default('SELECT * FROM "training-requests"');
            const stream = client.query(query);
            stream.on('end', release);
            stream.pipe(writeableStream);
        });
    }
    create(name, offeringId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO "training-requests" (name, "offering-id") values ($1, $2) RETURNING *';
            const parameter = [name, offeringId];
            const result = yield this.pool.query(query, parameter);
            return result.rows[0];
        });
    }
}
exports.TrainingRequestService = TrainingRequestService;
