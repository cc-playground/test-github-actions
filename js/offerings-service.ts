import { Pool } from 'pg';
import { Logger } from 'pino';

export type Offering = {
    id: number,
    name: string,
    description: string
}

export class OfferingsService {
    private logger: Logger;

    constructor(private pool: Pool, parentLogger: Logger){
        this.logger = parentLogger.child({module: this.constructor.name});
    }

    private offerings: Offering[]= [
        {   
            "id": 1,
            "name": "Cloud Native Bootcamp",
            "description": "A flexible classroom coaching format, focused on assisted self-learning."
        }
    ]

    public getAll(): Offering[] {
        this.logger.info(`querying all offerings`);
        return this.offerings
    }
    
    public getByName(name: string): Offering {
        return this.offerings.filter((offering) => offering.name == name)[0]
    }

    public existsByName(name: string): boolean {
        return this.offerings.filter((offering) => offering.name == name).length == 1
    }
}