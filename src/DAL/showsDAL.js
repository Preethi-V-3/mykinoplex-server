import ShowsModel from '../models/Shows';
import { CustomError } from '../CustomError';

export async function dbFetchShows(conditions) {
    return await ShowsModel.find(conditions)
        .orFail(new CustomError('No shows found!', 204))
        .then((shows) => {
            return { data: shows, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: err.status || 520 };
        });
}

export async function dbFindShow(conditions) {
    return await ShowsModel.findOne(conditions)
        .orFail(new CustomError('show does not exist!', 204))
        .then((show) => {
            return { data: show, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: err.status || 520 };
        });
}

export async function dbUpdateShow(conditions, session) {
    let date = new Date().valueOf();
    const opts = { session, setDefaultsOnInsert: true, new: true };
    
    return ShowsModel.findOneAndUpdate(conditions,
        { $set: { inactivatedDateTime: date } },
        opts)
        .then((ushow) => {
            return { data: ushow, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbCreateShow(shows) {
    return ShowsModel.create(shows)
        .then((ishows) => {
            return { data: ishows, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbSaveShow(show) {
    return show.save()
        .then((sshow) => {
            return { data: sshow, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbDeleteShow(conditions) {
    let date = new Date().valueOf();

    return ShowsModel.updateMany(conditions,
        { $set: { deletedDateTime: date } })
        .then((show) => {
            return { data: show, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}