// routes/api/theaterAPI.js
import express from 'express';
import {
    theatersGet, theaterGet, theatersPost, theaterPut, theaterDelete
} from '../../controllers/theatersController';
import { authHttp } from '../../middleware/auth';

var theaterAPI = express.Router();

// get request to fetch all theaters
theaterAPI.get('/', theatersGet);
// get request to fetch theater info by id
theaterAPI.get('/:theaterid', theaterGet);
// post request to save new theater info
theaterAPI.post('/', authHttp, theatersPost);
// put request to update theater info
theaterAPI.put('/:theaterid', authHttp, theaterPut);
// delete request to delete theater info
theaterAPI.delete('/:theaterid', authHttp, theaterDelete);

export default theaterAPI;