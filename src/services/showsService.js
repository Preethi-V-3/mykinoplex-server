import { dbSaveShow, dbFetchShows, dbFindShow, dbCreateShow } from '../DAL/showsDAL';

/*
  * if you need to make calls to additional tables, data stores, 
  * or call an external endpoint as part of creating or fetching the show, 
  * add them to this service
*/
export const createShow = async (shows) => {
    try {
        let insertedShow = await dbCreateShow(shows);
        if (insertedShow.status === 520) {
            throw (insertedShow.data);
        }
        return insertedShow.data;
    } catch (err) {
        throw new Error('createShow: ' + err.toString());
    }
};

export const updateShow = async (show, session) => {
    try {
        // update existing show value as inactive and insert new entry
        let conditions = {
            showId: show.showId, showStatus: "Now Showing",
            inactivatedDateTime: 0, deletedDateTime: 0
        };

        await dbUpdateShow(conditions, session);

        show.$session(session);
        let newShow = await dbSaveShow(show);
        if (newShow.status === 520) {
            throw (newShow.data);
        }
        return newShow.data;
    } catch (err) {
        throw new Error('updateShow: ' + err.toString());
    }
};

export const deleteShow = async (showId) => {
    try {
        let conditions = { showId: showId, showStatus: "Now Showing", deletedDateTime: 0 };

        let deletedshow = await dbDeleteShow(conditions);
        if (deletedshow.status === 520) {
            throw (deletedshow.data);
        }
        return deletedshow.data;
    } catch (err) {
        throw new Error('deleteshow: ' + err.toString());
    }
};

export const fetchShowsByIds = async (showIds) => {
    try {
        let conditions = { showId: { $in: showIds }, inactivatedDateTime: 0, deletedDateTime: 0 };

        const shows = await dbFetchShows(conditions);
        if (shows.status === 520) {
            throw (shows.data);
        }
        return shows;
    } catch (err) {
        throw new Error('fetchShowsByIds: ' + err.toString());
    }
};

export const fetchShowsByStatus = async (showStatus) => {
    try {
        let conditions = { showStatus: { $in: showStatus},  inactivatedDateTime: 0, deletedDateTime: 0 };

        const shows = await dbFetchShows(conditions);
        if (shows.status === 520) {
            throw (shows.data);
        }
        return shows;
    } catch (err) {
        throw new Error('fetchShowsByStatus: ' + err.toString());
    }
};

export const fetchShowById = async (showId) => {
    try {
        let conditions = { showId: showId, inactivatedDateTime: 0, deletedDateTime: 0 };

        const show = await dbFindShow(conditions);
        if (show.status === 520) {
            throw (show.data);
        }
        return show;
    } catch (err) {
        throw new Error('fetchShowById: ' + err.toString());
    }
};

export const fetchAllShows = async () => {
    try {
        let conditions = { inactivatedDateTime: 0, deletedDateTime: 0 }
        let shows = await dbFetchShows(conditions);
        if (shows.status === 520) {
            throw (shows.data);
        }
        return shows;
    } catch (err) {
        throw new Error('fetchAllShows: ' + err.toString());
    }
};