import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middlewares/errorMiddlewares.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB();
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());

app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
