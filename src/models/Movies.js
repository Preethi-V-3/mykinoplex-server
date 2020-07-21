import { Schema, model } from 'mongoose';

// this will be our database's movie data structure
const MovieSchema = new Schema(
  {
    id: false,
    movieId: {
      type: Schema.Types.ObjectId,
      required: [true, "{PATH} is required"]
    },
    movieName: {
      type: String,
      trim: true,
      required: [true, "{PATH} is required"]
    },
    tagline: {
      type: String,
      trim: true
    },
    synopsis: {
      type: String,
      trim: true
    },
    cast: {
      type: String,
      trim: true
    },
    trailerUrl: String,
    genre: { 
      type: [String] 
    },
    posterimage: {
      data: Buffer,
      contentType: String
    },
    backdropimage: {
      data: Buffer,
      contentType: String
    },
    language: {
      type: String,
      required: [true, "{PATH} is required"]
    },
    status: {
      type: String,
      trim: true,
      required: [true, "{PATH} is required"],
      enum: ["Now Showing", "Coming Soon", "Done"],
      default: "Coming Soon"
    },
    organiserId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "{PATH} is required"]
    },
    showIds: {
      type: [Schema.Types.ObjectId],
      ref: "shows"
    },
    inactivatedDateTime: {
      type: Number,
      default: 0
    },
    deletedDateTime: {
      type: Number,
      default: 0
    },
    totalHours: {
      type: Number,
      default: 3
    }
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
export default model(
  "movies",
  MovieSchema,
);
