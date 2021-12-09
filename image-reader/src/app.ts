import express from 'express';
import { json } from 'body-parser';

import { indexImageRouter } from './routes';

const app = express();
app.use(json());

app.use(indexImageRouter);
app.all('*', async () => {
  throw new Error('Route not found');
});

export { app }