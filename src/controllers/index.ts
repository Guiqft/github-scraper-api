import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import Scraper from '../scraper'
import Cache from '../cache'
import { IFile } from '../types'

export const GithubSizeController = async (req: Request, res: Response) => {
    try {
        // Checking if the url is valid
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new Error(`${(errors.array())[0].msg}`)
        }

        // Setting repository URL
        const repositoryUrl = req.query.url as string

        // Trying to retrieve cache
        let cachedFileList: IFile[] = []
        Cache.client.get(repositoryUrl, (error, value) => {
            if (value) {
                cachedFileList = JSON.parse(value)

                // If has cache, returns the list
                return res.status(200).json({ cachedFileList })
            }
        })

        // If hasn't cache, do the job
        const githubScraper = new Scraper(repositoryUrl)
        const fileList = await githubScraper.getFiles()
        await githubScraper.getFilesSize(fileList)

        // Setting the cache for this repository
        Cache.client.set(repositoryUrl, JSON.stringify(fileList))
        return res.status(200).json({ fileList })
    } catch (e) {
        return res.status(400).json({ error: e.message })
    }
}