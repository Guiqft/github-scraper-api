import app from './src/app'
import Cache from './src/cache'
import Request from 'supertest'

describe("Testing the github scraper route", () => {
    test("It should response a file list", async () => {
        const response = await Request(app)
            .get("/github-repository-size")
            .query({ url: "https://github.com/Guiqft/github-scraper-api" })

        expect(response.status).toBe(200)
    }, 240000)
})

afterAll((done) => {
    Cache.client.quit()
    done()
})