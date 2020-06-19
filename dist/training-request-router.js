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
exports.TrainingRequestRouter = void 0;
const express_1 = require("express");
class TrainingRequestRouter {
    constructor(trainingRequestService, offeringsService) {
        this.router = express_1.Router();
        this.router.get('/', function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const jsonStream = require('JSONStream').stringify();
                trainingRequestService.getAllStreamTo(jsonStream);
                jsonStream.pipe(response);
            });
        });
        this.router.post('/', function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                const { contact, offeringName } = request.body;
                if (contact == undefined) {
                    response.status(406).send(`Please provide a contact.`);
                }
                if (!offeringsService.existsByName(offeringName)) {
                    response.status(406).send(`Offering "${offeringName}" does not exist.`);
                }
                const offering = offeringsService.getByName(offeringName);
                const trainingRequest = yield trainingRequestService.create(name, offering.id);
                response.status(201).json(trainingRequest);
            });
        });
    }
}
exports.TrainingRequestRouter = TrainingRequestRouter;
