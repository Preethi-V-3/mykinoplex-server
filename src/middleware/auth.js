import jwt from 'jsonwebtoken';
import { fetchUserByIdToken } from '../services/userService';
import { JWT_SECRET } from '../configs/config';

//const config = require('../configs/config');

export const authHttp = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token)
            throw new Error('Auth Error');

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await fetchUserByIdToken(decoded._id, token);

        if (user.status === 204)
            throw new Error('Invalid token!');

        req.user = user.data;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send({ error: err.toString() }) && next(err);
    }
};