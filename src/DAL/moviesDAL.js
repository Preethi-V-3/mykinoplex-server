import MoviesModel from '../models/Movies';
import { CustomError } from '../CustomError';

export async function dbFetchMovies(conditions) {
    return await MoviesModel.find(conditions)
        .orFail(new CustomError('No movies found!', 204))
        .then((movies) => {
            return { data: movies, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: err.status || 520 };
        });
}

export async function dbFindMovie(conditions) {
    return await MoviesModel.findOne(conditions)
        .orFail(new CustomError('movie does not exist!', 204))
        .then((movie) => {
            return { data: movie, status: 200 };
        })
        .catch(err => {
            return { data: err.message, status: err.status || 520 };
        });
}

export async function dbUpdateMovie(conditions, session) {
    let date = new Date().valueOf();
    const opts = { session, setDefaultsOnInsert: true, new: true };
    return MoviesModel.findOneAndUpdate(conditions,
        { $set: { inactivatedDateTime: date } },
        opts)
        .then((umovie) => {
            return { data: umovie, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbSaveMovie(movie) {
    return movie.save()
        .then((smovie) => {
            return { data: smovie, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}

export async function dbDeleteMovie(conditions) {
    let date = new Date().valueOf();

    return MoviesModel.updateMany(conditions,
        { $set: { deletedDateTime: date } })
        .then((movie) => {
            return { data: movie, status: 201 };
        })
        .catch(err => {
            return { data: err.message, status: 520 };
        });
}