const QueryStream = require('pg-query-stream');

exports.TrainingRequestService = function (pool) {
    this.getAllStreamTo = async (writeableStream) => {
        pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
            const query = new QueryStream('SELECT * FROM "training-requests"');
            const stream = client.query(query);
            stream.on('end', release);
            stream.pipe(writeableStream);
        });
    }

    this.create = async (name) => {
        await pool.query('INSERT INTO "training-requests" (name) values ($1)', [name]);
    } 
}