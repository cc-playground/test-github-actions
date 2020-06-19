import express , {Request, Response} from 'express'
import { OfferingsService } from './offerings-service';

export class OfferingsRouter {

    public router = express.Router()

    constructor(offeringsService: OfferingsService) {
        this.router.get('/', (request: Request, response: Response) => {
            request.log.info('request on offerings');
            response.send(offeringsService.getAll());
        });
    }
}