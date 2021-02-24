import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import Scraper from '../scraper'
import Cache from '../cache'
import Logger from '../logger'

export const GithubSizeController = async (req: Request, res: Response) => {
    try {
        // Checking if the url is valid
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new Error(`${(errors.array())[0].msg}`)
        }

        // Setting repository URL
        const repositoryUrl = req.query.url as string

        var fileList = []
        // Trying to retrieve cache
        Logger.info(`Checking if exists cache for ${repositoryUrl}`)
        const cachedList = await Cache.client.get(repositoryUrl)

        if (cachedList) {
            Logger.info('Cache found!')
            fileList = JSON.parse(cachedList)
        }

        // If hasn't cache, do the job
        else {
            Logger.info('Cache not found')
            const githubScraper = new Scraper(repositoryUrl)
            fileList = await githubScraper.run()
        }

        return res.status(200).json(fileList)
    } catch (e) {
        return res.status(400).json({ error: e.message })
    }
}