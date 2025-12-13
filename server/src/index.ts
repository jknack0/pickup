import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './utils/logger';

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express Server!');
});

mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error('Failed to connect to MongoDB', err));

app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
});
