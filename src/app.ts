import express from 'express'
import cors from 'cors'
import { query } from 'express-validator';
import { checkGithubUrl } from './utils';
import { GithubSizeController } from './controllers';

const app = express();

app.use(express.json())
app.use(cors())

app.get(
    '/github-repository-size',
    query('url').notEmpty().isString().customSanitizer(checkGithubUrl),
    GithubSizeController
)

export default app
