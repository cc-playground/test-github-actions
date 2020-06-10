const express = require('express')

exports.OfferingsRouter = function (offeringsService) {

    this.router = express.Router()
    this.router.get('/', (request, response) => {
        response.send(offeringsService.getAll());
    });
}