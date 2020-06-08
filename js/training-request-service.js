const QueryStream = require('pg-query-stream');

exports.TrainingRequestService = function (pool, offeringsService) {
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

    this.create = async (name, offeringId) => {
        const query = 'INSERT INTO "training-requests" (name, "offering-id") values ($1, $2) RETURNING *';
        const parameter = [name, offeringId];
        const result = await pool.query(query, parameter);
        return result.rows[0]
    } 
}