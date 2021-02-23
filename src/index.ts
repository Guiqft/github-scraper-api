import express from 'express'
import { query } from 'express-validator';
import { checkGithubUrl } from './utils';

import { GithubSizeController } from './controllers';

const app = express();
const PORT = 8000;

app.use(express.json())

app.get('/github-repository-size',
    query('url').notEmpty().isString().customSanitizer(checkGithubUrl),
    GithubSizeController
)

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
