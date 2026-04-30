import express from 'express';
import timelineRouter from './routes/timeline';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/api/timeline', timelineRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
