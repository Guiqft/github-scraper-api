# GitHub Scraper API

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <img src="https://i.ibb.co/s3FFcyt/Frame-1-2.png" alt="Logo" width="180" height="180">

  <p align="center">
    This project was made as a challenge for a seletive process. The challenge consists to build a API with one route that, gived an GitHub repository url, return the numbers of lines and bytes grouped by files extensions. But I was not allowed to use the GitHub API either web scraping libraries.
    <br />
    Besides that, the challenge explicit that the API user should not receive timeout errors either long time responses for subsequent requests.
    <br />
  </p>
</p>

## My Solution
Here you can see my discuss about the solution and the technologies choices: [Challenge Solution](https://www.notion.so/Github-Scraper-API-ec77854e930841c3bba0bf79a6cade9d)

## Endpoints
`
http://api.gh-scraper.ml/github-repository-size/?url={{ repository_url }}
`

## Dependencies

* [Typescript](https://github.com/microsoft/TypeScript)
* [Axios](https://github.com/axios/axios)
* [Express](https://github.com/expressjs/express)
* [Express CORS](https://github.com/expressjs/cors)
* [Express Validator](https://github.com/express-validator/express-validator)
* [HTML Parser](https://github.com/taoqf/node-html-parser)
* [Redis](https://github.com/redis/redis)
* [Winston](https://github.com/winstonjs/winston)
