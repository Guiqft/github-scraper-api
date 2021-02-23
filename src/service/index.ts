import axios, { AxiosInstance } from 'axios'

export default class Service {
    client: AxiosInstance

    constructor (url: string) {
        this.client = axios.create({
            baseURL: url
        })
    }

    /**
     * Method to fetch a url and return a Promise.
     *
     * @private
     * @param pageUrl The url to be fetched.
     * @return The url Promise .
     * @memberof Scraper
     */
    async fetch (pageUrl: string) {
        if (process.env.DEBUG) { console.log('Fetching', pageUrl) }
        try {
            return this.client.get(pageUrl)
        }
        catch (e) {
            throw new Error(`Error while fetching ${pageUrl}: ${e.message}`)
        }
    }
}