import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import apiRoutes from './routes';

const app = express();


app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());


app.get('/', (_request, response) => {
  response.status(200).json({
    message: 'Comedor Digital Atencingo API',
    status: 'OK',
    version: '1.0.0',
  });
});



app.get('/api/health', (_request, response) => {
  response.status(200).json({
    database: 'PostgreSQL',
    api: 'online',
  });
});


app.use('/api', apiRoutes);

export default app;