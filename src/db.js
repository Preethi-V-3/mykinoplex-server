import mongoose from 'mongoose';
import { mongo } from './configs/config';

mongoose.Promise = global.Promise;

export function InitiateMongoServer() {
    // mongoose connection to database
    mongoose.connect(mongo.URI, mongo.options);

    const connection = mongoose.connection;
    // making sure we use the correct database
    connection.useDb(mongo.dbName);
    // If the connection throws an error
    connection.on('error', console.error.bind(console, 'connection error:'));
    // When the connection is disconnected
    connection.on('disconnected', () => {
        console.log('Mongoose default connection disconnected');
    });
    // When the connection is connected or open
    connection.on('connected', () => {
        console.log('Mongoose default connection open to db:', connection.db.databaseName);
    });
}