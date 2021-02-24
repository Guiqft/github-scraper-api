import asyncRedis from 'async-redis'
import { load } from 'ts-dotenv';

const env = load({
    REDIS_HOST: String,
    REDIS_PORT: Number,
    REDIS_KEY: String
});

class Cache {
    client: any

    constructor () {
        this.client = asyncRedis.createClient({
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            password: env.REDIS_KEY,
            tls: { servername: env.REDIS_HOST }
        })
    }
}

export default new Cache()