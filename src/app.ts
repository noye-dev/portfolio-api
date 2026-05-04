import express from 'express';
import timelineRouter from './routes/timeline';

export const app = express();

app.use(express.json());
app.use('/api/timeline', timelineRouter);
