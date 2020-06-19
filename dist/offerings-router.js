"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferingsRouter = void 0;
const express_1 = __importDefault(require("express"));
class OfferingsRouter {
    constructor(offeringsService) {
        this.router = express_1.default.Router();
        this.router.get('/', (request, response) => {
            request.log.info('request on offerings');
            response.send(offeringsService.getAll());
        });
    }
}
exports.OfferingsRouter = OfferingsRouter;
