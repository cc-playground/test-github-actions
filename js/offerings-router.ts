import express , {Request, Response} from 'express'
import { OfferingsService } from './offerings-service';

export class OfferingsRouter {

    public router = express.Router()

    constructor(offeringsService: OfferingsService) {
        this.router.get('/', (request: Request, response: Response) => {
            response.send(offeringsService.getAll());
        });
    }
}