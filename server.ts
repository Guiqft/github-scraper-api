import app from './src/app'
import Logger from './src/logger';

const PORT = 8000;

app.listen(PORT, () => {
    Logger.info(`Server is running at https://localhost:${PORT}`);
});