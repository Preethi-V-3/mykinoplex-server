import {
    dbSaveUser,
    dbFindUser,
    dbValidateUser,
    dbgenerateAuthToken,
    dbUpdateUser,
    dbDeleteUser
} from '../DAL/usersDAL';

/*
  * if you need to make calls to additional tables, data stores, 
  * or call an external endpoint as part of creating or fetching the user, 
  * add them to this service
*/
export const createUser = async (user) => {
    try {
        let insertedUser = await dbSaveUser(user);
        if (insertedUser.status === 520) {
            throw (insertedUser.data);
        }
        return insertedUser.data;
    } catch (err) {
        throw new Error('createUser: ' + err.toString());
    }
};

export const updateTokens = async (user) => {
    try {
        let updatedUser = await dbSaveUser(user);
        if (updatedUser.status === 520) {
            throw (updatedUser.data);
        }
        return updatedUser.data;
    } catch (err) {
        throw new Error('updateTokens: ' + err.toString());
    }
};

export const updateUser = async (user, session) => {
    try {
        // update existing theater value as inactive and insert new entry
        let conditions = { userId: user.userId, inactivatedDateTime: 0, deletedDateTime: 0 };

        await dbUpdateUser(conditions, session);

        user.$session(session);
        let newUser = await dbSaveUser(user);
        if (newUser.status === 520) {
            throw (newUser.data);
        }
        return newUser.data;
    } catch (err) {
        throw new Error('updateUser: ' + err.toString());
    }
};

export const deleteUser = async (userId) => {
    try {
        let deletedUser = await dbDeleteUser(userId);
        if (deletedUser.status === 520) {
            throw (deletedUser.data);
        }
        return deletedUser.data;
    } catch (err) {
        throw new Error('deleteUser: ' + err.toString());
    }
};

export const validateUser = async (email, password) => {
    try {
        let user = await dbValidateUser(email, password);
        if (user.status === 520) {
            throw (user.data);
        }
        return user.data;
    } catch (err) {
        throw new Error('validateUser: ' + err.toString());
    }
};

export const fetchUserInfoById = async (userId) => {
    try {
        let conditions = { _id: userId };

        const user = await dbFindUser(conditions);
        if (user.status === 520) {
            throw (user.data);
        }
        return user;
    } catch (err) {
        throw new Error('fetchUserInfoById: ' + err.toString());
    }
};

export const fetchUserByIdToken = async (userId, token) => {
    try {
        let conditions = { _id: userId, 'tokens.token': token };

        const user = await dbFindUser(conditions);
        if (user.status === 520) {
            throw (user.data);
        }
        return user;
    } catch (err) {
        throw new Error('fetchUserByIdToken: ' + err.toString());
    }
};

export const fetchUserByEmail = async (email) => {
    try {
        let conditions = { email: email };

        let user = await dbFindUser(conditions);
        if (user.status === 520) {
            throw (user.data);
        }
        return user;
    } catch (err) {
        throw new Error('fetchUserByEmail: ' + err.toString());
    }
};

export const generateAuthToken = async (user) => {
    try {
        let authToken = await dbgenerateAuthToken(user);
        if (authToken.status === 520) {
            throw (authToken.data);
        }
        return authToken.data;
    } catch (err) {
        throw new Error('generateAuthToken: ' + err.toString());
    }
};