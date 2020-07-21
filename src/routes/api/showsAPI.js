// routes/api/showsAPI.js
import express from 'express';
import {
    showsGet, showPut, showGet, showsPost, showDelete
} from '../../controllers/showsController';
import { authHttp } from '../../middleware/auth';

var showsAPI = express.Router();

// get request to fetch all shows of a movie
showsAPI.get('/', showsGet);
// get request to fetch show info by id
showsAPI.get('/:showid', showGet);
// post request to save new show info
showsAPI.post('/', authHttp, showsPost);
// put request to update show info by id
showsAPI.put('/:showid', authHttp, showPut);
// delete request to remove show for the movie
showsAPI.delete('/:showid', authHttp, showDelete);

export default showsAPI;