import UserModel from '../models/Users';
import { CustomError } from '../CustomError';

export async function dbFetchUsers(conditions) {
    return await UserModel.find(conditions)
        .orFail(new CustomError('No users found!', 204))
        .then((users) => {
            return { data: users, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: err.status || 520 };
        });
}

export async function dbFindUser(conditions) {
    return await UserModel.findOne(conditions)
        .orFail(new CustomError('User does not exist!', 204))
        .then((user) => {
            return { data: user, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: err.status || 520 };
        });
}

export async function dbSaveUser(user) {
    return await user.save()
        .then((user) => {
            return { data: user, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbValidateUser(email, password) {
    return await UserModel.findByCredentials(email, password)
        .then((user) => {
            return { data: user, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbgenerateAuthToken(user) {
    return await user.generateAuthToken()
        .then((token) => {
            return { data: token, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbUpdateUser(conditions, session) {
    let date = new Date().valueOf();
    const opts = { session, setDefaultsOnInsert: true, new: true };

    return UserModel.findOneAndUpdate(conditions,
        { $set: { inactivatedDateTime: date } },
        opts)
        .then((uUser) => {
            return { data: uUser, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbDeleteUser(userId) {
    let date = new Date().valueOf();

    return UserModel.updateMany(
        { userId: userId, deletedDateTime: 0 },
        { $set: { deletedDateTime: date } })
        .then((user) => {
            return { data: user, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}