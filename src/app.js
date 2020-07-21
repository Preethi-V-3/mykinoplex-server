import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import winston from '../winston';

const app = express();
const db = require('./db.js');

db.InitiateMongoServer();
//seed.seedData();

app.use(logger('combined', { stream: winston.stream }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

//import routes directory
require('./routes').default(app);

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('App terminated, closing mongo connections');
    process.exit(0);
  });
});

export default app;