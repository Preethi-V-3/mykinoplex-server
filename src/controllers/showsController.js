// queries for showdetails collection to read and write
import ShowModel from "../models/Shows";
import { connection } from "mongoose";
import {
    createShow, deleteShow,
    fetchShowById, fetchShowsByIds,
    fetchAllShows, updateShow,
    fetchShowsByStatus
} from "../services/showsService";

export async function showGet(req, res, next) {
    try {
        let showId = req.params.showid;

        let show = await fetchShowById(showId);
        res.status(201).send(show);
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }
}

export async function showsGet(req, res, next) {
    try {
        let queryparams = req.query;
        let shows = [];

        if (queryparams.showStatus !== undefined) {
            shows = await fetchShowsByStatus(queryparams.showStatus)
        } 
        else if (queryparams.showIds !== undefined) {
            shows = await fetchShowsByIds(queryparams.showIds)
        }
        else {
            shows = await fetchAllShows();
        }
        res.status(200).send(shows);
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }
}

export async function showsPost(req, res, next) {
    try {
        console.log(req.body);
        let showsArray = new Array();

        for (let i = 0; i < req.body; i++) {
            const { bookNowUrl, startTime, theaterId } = req.body[i];

            let showdetails = new ShowModel({
                showId: new mongoose.Types.ObjectId(),
                bookNowUrl: bookNowUrl,
                theaterId: theaterId,
                startTime: startTime
            });

            showsArray.push(showdetails);
        }
        let insShows = await createShow(showsArray);
        res.status(201).send(insShows);
    } catch (err) {
        res.status(500).send(err.toString()) & next(err);
    }
}

export async function showPut(req, res, next) {
    const session = await connection.startSession();
    session.startTransaction();
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['bookNowUrl', 'showStatus', 'theaterId', 'startTime'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new Error('Invalid updates!');
        }

        let showId = req.params.showid;
        const { bookNowUrl, startTime, showStatus, theaterId } = req.body;

        let show = new ShowModel({
            showId: showId,
            bookNowUrl: bookNowUrl,
            startTime: startTime,
            showStatus: showStatus,
            theaterId: theaterId
        });

        let uShow = await updateShow(show, session);

        await session.commitTransaction();
        session.endSession();

        res.status(201).send(uShow);
    } catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        await session.abortTransaction();
        session.endSession();

        return res.status(400).send(error.toString()) && next(error);
    }
}

export async function showDelete(req, res, next) {
    try {
        let showId = req.params.showid;

        await deleteShow(showId);
        res.status(201).send("delete show successfull");
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }
} 