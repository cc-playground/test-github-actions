const express = require('express');

exports.Server = function (trainingRequestRouter, offeringsRouter) {

    const environment = process.env.NODE_ENV || 'production';
    
    let httpServer
    const app = express();
    app.use(express.json());

    app.use(function(req, res, next) {
        if(environment === 'development') {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081')
        }
        next();
    });

    app.use('/api/v1/offerings', offeringsRouter.router);
    app.use('/api/v1/requests', trainingRequestRouter.router);
    
    this.setCORSHeader = () => {
        
    }

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