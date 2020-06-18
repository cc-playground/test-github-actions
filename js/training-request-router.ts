import { TrainingRequestService } from "./training-request-service";
import { OfferingsService } from "./offerings-service";
import { Request, Response, Router } from "express";

export class TrainingRequestRouter {

    public router = Router()

    constructor(
        trainingRequestService: TrainingRequestService,
        offeringsService: OfferingsService
    ) {

        this.router.get('/', async function (request: Request, response: Response) {
            // we deliberately abstain from typings here due to casing issues in the docker build
            const jsonStream: NodeJS.ReadWriteStream = require('JSONStream').stringify()
            trainingRequestService.getAllStreamTo(jsonStream);
            jsonStream.pipe(response)
        });
        
        this.router.post('/', async function (request: Request, response: Response) {
            const { contact, offeringName } = request.body
            if ( contact == undefined) {
                response.status(406).send(`Please provide a contact.`)
            }
            if (!offeringsService.existsByName(offeringName)){
                response.status(406).send(`Offering "${offeringName}" does not exist.`)
            }
            const offering = offeringsService.getByName(offeringName)
            const trainingRequest = await trainingRequestService.create(name, offering.id);
            response.status(201).json(trainingRequest)
        });
    }
}