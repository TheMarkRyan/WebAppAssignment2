import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRouter from './api/users';
import authenticate from './authenticate';
import './db';
import defaultErrHandler from './errHandler';
import moviesRouter from './api/movies';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Enable CORS for all origins
app.use(cors());

app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/movies', authenticate, moviesRouter);
app.use('/api/movies', moviesRouter); // Ensure the correct order

app.use(defaultErrHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
