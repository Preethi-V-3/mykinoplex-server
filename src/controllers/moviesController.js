import MovieModel from '../models/Movies';
import { 
    fetchMoviesByIds, fetchMoviesByStatus, fetchAllMovies, fetchMovieById, deleteMovie, createMovie, updateMovie 
} from '../services/moviesService';

// queries for movieinfo collection to read and write
export async function moviesGet(req, res, next) {
    try {
        let queryparams = req.query;
        let movies = [];

        if (queryparams.movieIds !== undefined) {
            movies = await fetchMoviesByIds(queryparams.movieIds);
        } 
        else if(queryparams.status !== undefined) {
            movies = await fetchMoviesByStatus(queryparams.status);
        }
        else {
            movies = await fetchAllMovies();
        }
        res.status(200).send(movies);
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }
}

export async function movieGet(req, res, next) {
    try {
        let movieId = req.params.movieid;

        let movie = await fetchMovieById(movieId);
        res.status(201).send(movie);
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }
}

export async function moviesPost(req, res, next) {
    const session = await db.startSession();
    session.startTransaction();
    try {
        const movieInfo = JSON.parse(req.body.movieInfo);
        movieInfo.showIds = [];
        const showsAry = JSON.parse(req.body.showsArray);
        const organiserId = req.user.userId;
        let showsArray = new Array();

        for (let i = 0; i < showsAry.length; i++) {
            const { bookNowUrl, startTime, theaterId } = showsAry[i];
            let showdetails = new ShowModel({
                showId: new mongoose.Types.ObjectId(),
                bookNowUrl: bookNowUrl,
                theaterId: theaterId,
                startTime: startTime
            });
            showdetails.$session(session);
            console.log(showdetails);
            showsArray.push(showdetails);

            movieInfo.showIds.push(showdetails.showId);
        }
        await createShow(showsArray);

        let movie = new MovieModel({
            movieId: new mongoose.Types.ObjectId(),
            movieName: movieInfo.movieName,
            tagline: movieInfo.tagline,
            synopsis: movieInfo.synopsis,
            cast: movieInfo.cast,
            trailerUrl: movieInfo.trailerUrl,
            genre: movieInfo.genre,
            language: movieInfo.language,
            showIds: movieInfo.showIds,
            organiserId: organiserId
        });
        movie.$session(session);
        let insMovie = await createMovie(movie);

        await session.commitTransaction();
        session.endSession();

        res.status(200).send(insMovie);
    } catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        await session.abortTransaction();
        session.endSession();

        res.status(400).send(error.toString()) && next(error);
    }
}

export async function moviePut(req, res, next) {
    const session = await db.startSession();
    session.startTransaction();
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['movieName', 'tagline', 'synopsis', 
            'cast', 'trailerUrl', 'genre', 'language', 'showIds'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new Error('Invalid updates!');
        }

        const movieId = req.params.movieid;
        const organiserId = req.user.userId;
        const movieInfo = req.body.movieInfo;
        
        let movie = new MovieModel({
            movieId: movieId,
            movieName: movieInfo.movieName,
            tagline: movieInfo.tagline,
            synopsis: movieInfo.synopsis,
            cast: movieInfo.cast,
            trailerUrl: movieInfo.trailerUrl,
            genre: movieInfo.genre,
            language: movieInfo.language,
            showIds: movieInfo.showIds,
            organiserId: organiserId
        });

        let uMovie = await updateMovie(movie, session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).send(uMovie);
    } catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        await session.abortTransaction();
        session.endSession();

        res.status(400).send(error.toString()) && next(error);
    }
}

export async function movieDelete(req, res, next) {
    try {
        let movieId = req.params.movieid;
        let organiserId = req.user.userId;

        await deleteMovie(movieId, organiserId);
        res.status(201).send("delete movie successfull");
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }  
}
