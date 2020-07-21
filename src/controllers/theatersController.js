import TheaterModel from "../models/Theaters";
import { connection } from "mongoose";
import { 
    createTheater, deleteTheater, 
    fetchTheaterById, fetchTheatersByIds, 
    fetchAllTheaters, 
    updateTheater
} from "../services/theatersService";

export async function theaterGet(req, res, next) {
    try {
        let theaterId = req.params.theaterid;

        let theater = await fetchTheaterById(theaterId);
        res.status(201).send(theater);
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }
}

export async function theatersGet(req, res, next) {
    try {
        let queryparams = req.query;
        let theaters = [];

        if(queryparams.theaterIds !== undefined) {
           theaters = await fetchTheatersByIds(queryparams.theaterIds)
        } else {
            theaters = await fetchAllTheaters();
        }
        res.status(200).send(theaters);
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }
}

export async function theatersPost(req, res, next) {
    try {
        console.log(req.body);
        const { theaterName, address } = req.body;
        let theater = new TheaterModel({
            theaterId: new mongoose.Types.ObjectId(),
            theaterName: theaterName,
            address: {
                country: address.country,
                city: address.city,
                street: address.street,
                zipcode: address.zipcode
            }
        });
        //theater.$session(session);
        let insTheater = await createTheater(theater);
        res.status(201).send(insTheater);
    } catch(err) {
        res.status(500).send(err.toString()) & next(err);
    }
}

export async function theaterPut(req, res, next) {
    const session = await db.startSession();
    session.startTransaction();
    try {
        const theaterId = req.params.theaterid;
        const { theaterName, address } = req.body;

        let theater = new TheaterModel({
            theaterId: theaterId,
            theaterName: theaterName,
            address: {
                country: address.country,
                city: address.city,
                street: address.street,
                zipcode: address.zipcode
            }
        });

        let uTheater = await updateTheater(theater, session);

        await session.commitTransaction();
        session.endSession();

        res.status(201).send(uTheater);
    } catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        await session.abortTransaction();
        session.endSession();

        return res.status(400).send(error.toString()) && next(error);
    }
}

export async function theaterDelete(req, res, next) {
    try {
        let theaterId = req.params.theaterid;

        await deleteTheater(theaterId);
        res.status(201).send("delete theater successfull");
    } catch (error) {
        res.status(400).send(error.toString()) & next(error);
    }
} 