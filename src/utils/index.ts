/* function to prevent user insert a wrong repository url */
export const checkGithubUrl = (url: string) => {
    if (url.includes('https://')) {
        if ((url.match(/^https:\/\/github\.com\/(.+)/) || []).length > 1) { /* Contains  https://github.com/something-else */
            return url /* Return url without corrections */
        }
    }

    else if ((url.match(/^github\.com\/(.+)/) || []).length > 1) { /* Contains just github.com/something-else */
        return 'https://' + url /* Adding https at start */
    }

    else throw new Error('Github url invalid')
}

export const getRepoInfo = (url: string) => {

}