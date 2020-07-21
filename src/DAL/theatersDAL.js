import TheatersModel from '../models/Theaters';
import { CustomError } from '../CustomError';

export async function dbFetchTheaters(conditions) {
    return await TheatersModel.find(conditions)
        .orFail(new CustomError('No theaters found!', 204))
        .then((theaters) => {
            return { data: theaters, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: err.status || 520 };
        });
}

export async function dbFindTheater(conditions) {
    return await TheatersModel.findOne(conditions)
        .orFail(new CustomError('Theater does not exist!', 204))
        .then((theater) => {
            return { data: theater, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: err.status || 520 };
        });
}

export async function dbUpdateTheater(conditions, session) {
    let date = new Date().valueOf();
    const opts = { session, setDefaultsOnInsert: true, new: true };
    return TheatersModel.findOneAndUpdate(conditions,
        { $set: { inactivatedDateTime: date } },
        opts)
        .then((utheater) => {
            return { data: utheater, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbSaveTheater(theater) {
    return theater.save()
        .then((stheater) => {
            return { data: stheater, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbDeleteTheater(theaterId) {
    let date = new Date().valueOf();

    return TheatersModel.updateMany(
        { theaterId: theaterId, deletedDateTime: 0 },
        { $set: { deletedDateTime: date } })
        .then((theater) => {
            return { data: theater, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}