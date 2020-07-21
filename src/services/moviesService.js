import { dbFetchMovies, dbFindMovie, dbDeleteMovie, dbSaveMovie, dbUpdateMovie } from '../DAL/moviesDAL';

/*
  * if you need to make calls to additional tables, data stores, 
  * or call an external endpoint as part of creating or fetching the movie, 
  * add them to this service
*/
export const createMovie = async (movie) => {
    try {
        let insertedmovie = await dbSaveMovie(movie);
        if (insertedmovie.status === 520) {
            throw (insertedmovie.data);
        }
        return insertedmovie.data;
    } catch (err) {
        throw new Error('createMovie: ' + err.toString());
    }
};

export const updateMovie = async (movie, session) => {
    try {
        // update existing movie value as inactive and insert new entry
        let conditions = {
            movieId: movie.movieId, organiserId: movie.organiserId, status: { $ne: "Done" },
            inactivatedDateTime: 0, deletedDateTime: 0 };

        await dbUpdateMovie(conditions, session);

        movie.$session(session);
        let newMovie = await dbSaveMovie(movie);
        if (newMovie.status === 520) {
            throw (newMovie.data);
        }
        return newMovie.data;
    } catch (err) {
        throw new Error('updateMovie: ' + err.toString());
    }
};

export const deleteMovie = async (movieId, organiserId) => {
    try {
        let conditions = {
            movieId: movieId, organiserId: organiserId, 
            status: { $ne: "Done" }, deletedDateTime: 0 };

        let deletedmovie = await dbDeleteMovie(conditions);
        if (deletedmovie.status === 520) {
            throw (deletedmovie.data);
        }
        return deletedmovie.data;
    } catch (err) {
        throw new Error('deletemovie: ' + err.toString());
    }
};

export const fetchMoviesByIds = async (movieIds) => {
    try {
        let conditions = { movieId: { $in: movieIds }, inactivatedDateTime: 0, deletedDateTime: 0 };

        const movies = await dbFetchMovies(conditions);
        if (movies.status === 520) {
            throw (movies.data);
        }
        return movies;
    } catch (err) {
        throw new Error('fetchMoviesByIds: ' + err.toString());
    }
};

export const fetchMoviesByStatus = async (movieStatus) => {
    try {
        let status = {};
        if(movieStatus === 'active') {
            status = { $ne: "Done" };
        }
        let conditions = { status: status, inactivatedDateTime: 0, deletedDateTime: 0 };

        const movies = await dbFetchMovies(conditions);
        if (movies.status === 520) {
            throw (movies.data);
        }
        return movies;
    } catch (err) {
        throw new Error('fetchMoviesByStatus: ' + err.toString());
    }
};

export const fetchMovieById = async (movieId) => {
    try {
        let conditions = { movieId: movieId, inactivatedDateTime: 0, deletedDateTime: 0 };

        const movie = await dbFindMovie(conditions);
        if (movie.status === 520) {
            throw (movie.data);
        }
        return movie;
    } catch (err) {
        throw new Error('fetchMovieById: ' + err.toString());
    }
};

export const fetchAllMovies = async () => {
    try {
        let conditions = { inactivatedDateTime: 0, deletedDateTime: 0 }
        let movies = await dbFetchMovies(conditions);
        if (movies.status === 520) {
            throw (movies.data);
        }
        return movies;
    } catch (err) {
        throw new Error('fetchAllMovies: ' + err.toString());
    }
};