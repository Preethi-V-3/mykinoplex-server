import { dbSaveTheater, dbDeleteTheater, dbFindTheater, dbFetchTheaters, dbUpdateTheater } from '../DAL/theatersDAL';

/*
  * if you need to make calls to additional tables, data stores, 
  * or call an external endpoint as part of creating or fetching the theater, 
  * add them to this service
*/
export const createTheater = async (theater) => {
    try {
        let insertedTheater = await dbSaveTheater(theater);
        if (insertedTheater.status === 520) {
            throw (insertedTheater.data);
        }
        return insertedTheater.data;
    } catch (err) {
        throw new Error('createTheater: ' + err.toString());
    }
};

export const updateTheater = async (theater, session) => {
    try {
        // update existing theater value as inactive and insert new entry
        let conditions = { theaterId: theater.theaterId, inactivatedDateTime: 0, deletedDateTime: 0 };

        await dbUpdateTheater(conditions, session);

        theater.$session(session);
        let newTheater = await dbSaveTheater(theater);
        if (newTheater.status === 520) {
            throw (newTheater.data);
        }
        return newTheater.data;
    } catch (err) {
        throw new Error('updateTheater: ' + err.toString());
    }
};

export const deleteTheater = async (theaterId) => {
    try {
        let deletedTheater = await dbDeleteTheater(theaterId);
        if (deletedTheater.status === 520) {
            throw (deletedTheater.data);
        }
        return deletedTheater.data;
    } catch (err) {
        throw new Error('deleteTheater: ' + err.toString());
    }
};

export const fetchTheaterById = async (theaterId) => {
    try {
        let conditions = {
            theaterId: theaterId,
            inactivatedDateTime: 0,
            deletedDateTime: 0
        };

        const theater = await dbFindTheater(conditions);
        if (theater.status === 520) {
            throw (theater.data);
        }
        return theater;
    } catch (err) {
        throw new Error('fetchTheaterById: ' + err.toString());
    }
};

export const fetchAllTheaters = async () => {
    try {
        let conditions = { inactivatedDateTime: 0, deletedDateTime: 0 };

        const theaters = await dbFetchTheaters(conditions);
        if (theaters.status === 520) {
            throw (theaters.data);
        }
        return theaters;
    } catch (err) {
        throw new Error('fetchAllTheaters: ' + err.toString());
    }
};

export const fetchTheatersByIds = async (theaterIds) => {
    try {
        let conditions = {
            theaterId: { $in: theaterIds },
            inactivatedDateTime: 0,
            deletedDateTime: 0
        };
        let theaters = await dbFetchTheaters(conditions);
        if (theaters.status === 520) {
            throw (theaters.data);
        }
        return theaters;
    } catch (err) {
        throw new Error('fetchTheatersByIds: ' + err.toString());
    }
};