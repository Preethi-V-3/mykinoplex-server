// routes/api/movieAPI.js
import express from 'express';
import {
    moviesGet, movieGet, moviesPost, moviePut, movieDelete
} from '../../controllers/moviesController';
import { authHttp } from '../../middleware/auth';

var movieAPI = express.Router();

// get request to fetch all the movies
movieAPI.get('/', moviesGet);
// get request to fetch movie info by id
movieAPI.get('/:movieid', movieGet);
// post request to save new movie info
movieAPI.post('/', authHttp, moviesPost);
// put request to update movie info
movieAPI.put('/:movieid', authHttp, moviePut);
// delete request to remove the movie info
movieAPI.delete('/:movieid', authHttp, movieDelete);

export default movieAPI;