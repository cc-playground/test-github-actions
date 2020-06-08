const express = require('express');
const JSONStream = require('JSONStream');

exports.Server = function (trainingRequestService, offeringsService) {

    let httpServer
    const app = express();
    app.use(express.json());

    app.get('/', async function (request, response) {
        const jsonStream = JSONStream.stringify()
        trainingRequestService.getAllStreamTo(jsonStream);
        jsonStream.pipe(response)
    });

    app.post('/', async function (request, response) {
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
    
    this.start = (port) => {
        httpServer = app
            .listen(port, function () {
                console.log(`Server started on port ${port}`);
            })
            .on('connection', function (socket) {
                socket.setTimeout(5 * 1000);
            })        
            .on('error', function (error) {
                console.error(`Failed to start server at port ${port}, port might be in use.`);
                console.error(error.stack);
                process.exit(2);
            });
    };
    
    this.stop = () => {
        httpServer.close(() => {
            console.log('Server shut down');
        });
    };
}