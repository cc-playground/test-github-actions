import QueryStream from 'pg-query-stream';
import { Pool } from 'pg';
import { Offering } from './offerings-service';

export class TrainingRequestService {

    constructor(private pool: Pool){}

    public getAllStreamTo(writeableStream: NodeJS.WritableStream): void {
        this.pool.connect((err, client, release) => {
            if (err) {
              return console.error('Error acquiring client', err.stack)
            }
            const query = new QueryStream('SELECT * FROM "training-requests"');
            const stream = client.query(query);
            stream.on('end', release);
            stream.pipe(writeableStream);
        });
    }

    public async create (name: string, offeringId: number): Promise<Offering> {
        const query = 'INSERT INTO "training-requests" (name, "offering-id") values ($1, $2) RETURNING *';
        const parameter = [name, offeringId];
        const result = await this.pool.query(query, parameter);
        return result.rows[0]
    } 
}