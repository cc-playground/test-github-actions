"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferingsService = void 0;
class OfferingsService {
    constructor(pool, parentLogger) {
        this.pool = pool;
        this.offerings = [
            {
                "id": 1,
                "name": "Cloud Native Bootcamp",
                "description": "A flexible classroom coaching format, focused on assisted self-learning."
            }
        ];
        this.logger = parentLogger.child({ module: this.constructor.name });
    }
    getAll() {
        this.logger.info(`querying all offerings`);
        return this.offerings;
    }
    getByName(name) {
        return this.offerings.filter((offering) => offering.name == name)[0];
    }
    existsByName(name) {
        return this.offerings.filter((offering) => offering.name == name).length == 1;
    }
}
exports.OfferingsService = OfferingsService;
