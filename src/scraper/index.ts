import { parse, HTMLElement } from 'node-html-parser';
import { getRepoInfo, getSizeFromPage, getInfosFromPage } from '../utils'
import { IFile, IRepository } from '../types'
import Service from '../service';

/**
 * Main scraper class to be instacied with the github repository url.
 *
 * @class Scraper
 * @constructor The github repository url.
 * @property - `client` { AxiosInstance } The axios client .
 *         - `repository` { IFile } Infos about the repository.
 *         - `fileList` { Array<IFile> } The scraped files list, including folders.
 */
export default class Scraper {
    service: Service
    repository: IRepository
    fileList: Array<IFile> = []

    /**
     * Creates an instance of Scraper.
     * 
     * @param {string} repositoryUrl The github repository url to be scraped.
     */
    constructor (repositoryUrl: string) {
        this.service = new Service(repositoryUrl)

        // Getting the infos from repository url
        this.repository = getRepoInfo(repositoryUrl)
    }

    /**
     * Function to fetch the repository and fill the files list.
     *
     * @return The fetched fileList.
     * @memberof Scraper
     */
    async getFiles (page?: HTMLElement): Promise<IFile[]> {
        let fileList: IFile[] = []

        // If page wasn't passed
        if (!page) {
            // Fetching the root page
            const rawHtml = (await this.service.fetch('/')).data
            page = parse(rawHtml)
        }

        // Filling the list with current page files
        fileList = getInfosFromPage(page)

        // Filtering just the folders
        const folderList = fileList.filter((file) => file.isFolder)
        const folderPromiseList = folderList.map((file) => this.service.fetch(file.url))

        // Calling all folder pages on list
        const folderPageList = (await Promise.all(folderPromiseList)).map(({ data }) => data)

        // Looping for each folder page
        for (const folderPage of folderPageList) {
            // Calling this function recursivelly
            fileList.push(...await this.getFiles(parse(folderPage)))
        }

        // Return and take off the folders
        return fileList.filter(({ isFolder }) => !isFolder)
    }

    /**
     * Function to get the size of each file html element from `fileList`.
     *
     * @param fileList The file list to get the sizes.
     * @memberof Scraper
     */
    async getFilesSize (fileList: IFile[]) {
        // Declaring batch size
        var nElements = Math.min(100, fileList.length)
        const nFiles = fileList.length

        // Looping in batches of nElements elements
        for (var startIndex = 0; startIndex < nFiles; startIndex += nElements) {
            // Calculate the current start index
            let endIndex = startIndex + nElements

            // Dealing with max end index
            if (endIndex > nFiles) endIndex = nFiles

            // Slicing the array for the current batch
            const currentFileList = fileList.slice(startIndex, endIndex)
            const currentPromiseList = currentFileList.map((file) => this.service.fetch(file.url))
            // Fetch all the batch urls
            const filePageList = (await Promise.all(currentPromiseList)).map(({ data }) => data)

            // Looping for each file in batch and filling the size
            for (var index = 0; index < nElements; index++) {
                const { lines, bytes } = getSizeFromPage(parse(filePageList[index]))

                // Filling the file size
                if (currentFileList[index]) currentFileList[index].size = { lines, bytes }
            }
        }
    }
}