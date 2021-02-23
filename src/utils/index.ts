import { HTMLElement } from "node-html-parser"
import { IFile, ISize } from "../types"
import { Request } from 'express'

/**
 * Verify the github repository url and, 
 * 
 * if valid, returns it as `https://github.com/owner/repository_name`
 * 
 * else, throw a error.
 *
 * @param url The github repository url to be checked.
 * @return The url on the right syntax.
 */
export const checkGithubUrl = async (url: string) => {
    if (url) {
        // Contains  https://
        if (url.includes('https://')) {
            // Contains  https://github.com/something-else 
            if ((url.match(/^https:\/\/github\.com\/(.+)/) || []).length > 1) {
                // Return url without corrections 
                return Promise.resolve(url)
            }
        }

        // Contains just github.com/something-else 
        else if ((url.match(/^github\.com\/(.+)/) || []).length > 1) {
            // Concat https:// on start 
            return Promise.resolve('https://' + url)
        }
    }

    return Promise.reject(JSON.stringify({ error: 'Invalid github repository url' }))
}

/**
 * Parse the repository url and returns his name and owner.
 *
 * @param url The repository url.
 * @return The name and owner of the repository.
 */
export const getRepoInfo = (url: string) => {
    return {
        name: (url.match(/^https:\/\/github\.com\/(.+)\/(.+)/) || [])[2],
        owner: (url.match(/^https:\/\/github\.com\/(.+)\/(.+)/) || [])[1]
    }
}

/**
* Get the row html element of each file from page
*
* @param filesPage The page to get the file rows
* @return The html element of file rows list
*/
export const getFilesRows = (filesPage: HTMLElement) => {
    // Getting files table element
    const fileTableElement = filesPage.querySelector('div[aria-labelledby=files]')

    // Here using slice(1) to take off unnecessary grid element 
    var rows = fileTableElement.querySelectorAll('div[role=row]').slice(1)

    rows = rows.filter(row => {
        const anchorTag = row.querySelector('a.js-navigation-open')

        return !anchorTag.attributes.title.includes('Go to parent directory')
    })

    return rows
}

/**
 * Run query selectors on each row html element and returns the list with files infos.
 * 
 * @param  row The page that contains the file table.
 * @return The list with the infos of each file.
 */
export const getInfosFromPage = (page: HTMLElement): IFile[] => {
    const fileList: IFile[] = []

    // Getting file row element
    const rows = getFilesRows(page)

    // Looping for each row element
    for (const row of rows) {
        // Folders has differents aria-label
        const isFolder = Boolean(row.querySelector('div[aria-label=Directory]'))

        // Getting file infos from <a /> tag 
        const anchorTag = row.querySelector('a.js-navigation-open')
        const name = anchorTag.rawText

        // Regex to take everything after last dot 
        const extension = (name.match('([^\.]+$)') || [])[1]

        // Removing repo name from url 
        const url = anchorTag.attributes.href.split('/').slice(3).join('/')

        fileList.push({
            name,
            extension,
            url,
            isFolder,
            size: {}
        })
    }

    return fileList
}

/**
 * Get a file page, scrap and returns the lines and bytes.
 * 
 * @param page The file page to get the size.
 * @return The bytes and lines from the specifed file page.
 */
export const getSizeFromPage = (page: HTMLElement): ISize => {
    // Selecting the divisor '|' so we can acess his parent
    const infoDivider = page.querySelector('span.file-info-divider]')
    let selector

    if (infoDivider)
        // If file has lines and bytes 
        selector = infoDivider.parentNode
    else {
        // If file has just bytes
        selector = page.querySelector('div.text-mono')
    }
    if (!selector) { return { lines: 0, bytes: 0 } }

    // Getting raw text from the selector node
    const infosText = selector.innerText.replace(/[\s\n]+/g, ' ').trim()

    // Getting lines and bytes numbers and setting 0 if file has no lines
    const lines = Number(infosText.split('lines')[0].trim()) || 0

    // Regex to take the last two words
    const bytesText = (infosText.match(/\w+\W+\w+$/) || [])[0]
    const bytes = parseBytes(bytesText)

    return { lines, bytes }
}

/**
 * Get a byte string and returns his value in raw bytes.
 *
 * @param bytesText The string to be parsed.
 * @return The raw bytes value.
 */
export const parseBytes = (bytesText: string): number => {
    const unit = bytesText.split(' ')[1]
    let multiplier

    // Defining the scale
    switch (unit) {
        case 'Bytes':
            multiplier = 1
            break;
        case 'KB':
            multiplier = 1024
            break;
        case 'MB':
            multiplier = 1024 * 1024
            break;
        default:
            multiplier = 0
    }

    const bytesNumber = Number(bytesText.split(' ')[0])

    // Returns multiplying by scale
    return bytesNumber * multiplier
}