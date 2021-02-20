import Scraper from './scraper'

const run = async () => {
    const githubScraper = new Scraper('https://github.com/ParadeTo/vue-tree-list')
    await githubScraper.getFiles()
    await githubScraper.getFilesSize()
}

run()
