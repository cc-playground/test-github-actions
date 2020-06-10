const express = require('express')
const JSONStream = require('JSONStream');

exports.TrainingRequestRouter = function (traingingRequestService, offeringsService) {

    this.router = express.Router()
    this.router.get('/', async function (request, response) {
        const jsonStream = JSONStream.stringify()
        trainingRequestService.getAllStreamTo(jsonStream);
        jsonStream.pipe(response)
    });

    this.router.post('/', async function (request, response) {
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