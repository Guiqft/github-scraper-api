import app from './src/app'
import Request from 'supertest'

describe("Testing the github scraper route", () => {
    test("It should response a file list", async (done) => {
        const response = await Request(app)
            .get("/github-repository-size")
            .query({ url: "https://github.com/Guiqft/github-scraper-api" })

        expect(response.status).toBe(200)
        done()
    }, 240000)
})

afterAll((done) => {
    done()
})