// routes/api/usersAPI.js
import express from 'express';
import {
    userRegisterPost, userLoginPost, 
    userLogoutPost, userLogoutAllPost, 
    userInfoGet, userInfoPut, userInfoDelete
} from '../../controllers/usersController';
import { authHttp } from '../../middleware/auth';

var usersAPI = express.Router();

// post request for signup the user
usersAPI.post('/signup', userRegisterPost);

// post request to login
usersAPI.post('/login', userLoginPost);

// post request to logout from one device
usersAPI.post('/logout', authHttp, userLogoutPost);

// post request to logout from all devices 
usersAPI.post('/logoutAll', authHttp, userLogoutAllPost);

// get request to fetch user info
usersAPI.get('/me', authHttp, userInfoGet);

// put request to update user info
usersAPI.put('/me', authHttp, userInfoPut);

// delete request to remove the user
usersAPI.delete('/me', authHttp, userInfoDelete);

export default usersAPI;