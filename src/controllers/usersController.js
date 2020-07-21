//queries to read and write from admin
import {
    createUser,
    validateUser,
    fetchUserByEmail,
    generateAuthToken,
    updateUser,
    deleteUser,
    updateTokens
} from '../services/userService';
import UserModel from '../models/Users';
import mongoose, { connection } from 'mongoose';

/*
 * call other imported services, or same service but different functions here if you need to
*/

export async function userRegisterPost(req, res, next) {
    try {
        const { fullname, email, password, organiserinfo } = req.body;

        const userInfo = {
            userId: new mongoose.Types.ObjectId(),
            fullname: fullname,
            email: email,
            password: password,
            organiserinfo: {
                name: organiserinfo.name,
                country: organiserinfo.country,
                city: organiserinfo.city,
                street: organiserinfo.street,
                zipcode: organiserinfo.zipcode
            }
        };

        let userExists = await fetchUserByEmail(userInfo.email);
        if (userExists.status === 200) {
            throw new Error('Email already registered!');
        }

        const user = await createUser(new UserModel(userInfo));
        const token = await generateAuthToken(user);
        //sendWelcomeEmail(user.email, user.name);

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.toString() }) && next(error);
    }
}

export async function userLoginPost(req, res, next) {
    try {
        const user = await validateUser(req.body.email, req.body.password);
        const token = await generateAuthToken(user);

        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.toString() }) && next(error);
    }
}

export async function userLogoutPost(req, res, next) {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await updateTokens(req.user);

        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: error.toString() }) && next(error);
    }
}

export async function userLogoutAllPost(req, res, next) {
    try {
        req.user.tokens = [];
        await updateTokens(req.user);

        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: error.toString() }) && next(error);
    }
}

export async function userInfoGet(req, res, next) {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send({ error: error.toString() }) && next(error);
    }
}

export async function userInfoPut(req, res, next) {
    const session = await connection.startSession();
    session.startTransaction();
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['fullname', 'password', 'organiserinfo'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new Error('Invalid updates!');
        }

        const { fullname, password, organiserinfo } = req.body;
        const user = {
            userId: req.user.userId,
            fullname: fullname,
            email: req.user.email,
            password: password,
            tokens: req.user.tokens,
            organiserinfo: {
                name: organiserinfo.name,
                country: organiserinfo.country,
                city: organiserinfo.city,
                street: organiserinfo.street,
                zipcode: organiserinfo.zipcode
            }
        };
        let updatedUser = await updateUser(user, session);

        await session.commitTransaction();
        session.endSession();

        res.status(201).send(updatedUser);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).send({ error: error.toString() }) && next(error);
    }
}

export async function userInfoDelete(req, res, next) {
    try {
        await deleteUser(req.user.userId);
        //sendCancelationEmail(req.user.email, req.user.name);
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send();
    }
}