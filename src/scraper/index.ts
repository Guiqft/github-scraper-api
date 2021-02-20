import axios, { AxiosInstance } from 'axios'
import { parse, HTMLElement } from 'node-html-parser';

import { checkGithubUrl } from '../utils'
import { IFile, IRepository } from '../types'

export default class Scraper {
    client: AxiosInstance
    static parsedPage: HTMLElement
    static repository: IRepository
    static filesList: Array<IFile> = []

    constructor (repositorUrl: string) {
        const formatedUrl = checkGithubUrl(repositorUrl)

        this.client = axios.create({
            baseURL: formatedUrl
        })

        Scraper.repository = {
            name: 'name',
            owner: 'onwer'
        }
    }

    async getFiles () {
        /* Fetching the entire page */
        const rawHtml = (await this.client.get('/')).data
        Scraper.parsedPage = parse(rawHtml)

        /* Getting files table */
        const fileTableElement = Scraper.parsedPage.querySelector('div[aria-labelledby=files]')
        const rows = fileTableElement.querySelectorAll('div[role=row]').slice(1) /* slice(1) to take off unnecessary element  */

        /* Looping for each row */
        for (const row of rows) {
            const isFolder = Boolean(row.querySelector('div[aria-label=Directory]')) /* Folders has differents aria-label*/

            /* Getting file infos from <a /> tag */
            const anchorTag = row.querySelector('a.js-navigation-open')
            const name = anchorTag.rawText
            const extension = (name.match('([^\.]+$)') || [])[1] /* regex to take everything after last dot */
            const url = anchorTag.attributes.href

            /* Pushing infos to file list */
            Scraper.filesList.push({
                name,
                extension,
                url,
                isFolder
            })
        }
    }

    async getFilesSize () {
        for (const file of Scraper.filesList) {
            try {
                const filePage = parse((await this.client.get(file.url)).data)

                if (!file.isFolder) {
                    const infoDivider = filePage.querySelector('span[class=file-info-divider]')
                    console.log(infoDivider.parentNode)
                }
            } catch (e) {
                console.log(this.client.defaults.baseURL + file.url)
                console.log(e.message)
            }
        }
    }
}