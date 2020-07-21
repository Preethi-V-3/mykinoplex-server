import { Schema, model } from 'mongoose';

// this will be our database's showdetails data structure
const ShowsSchema = new Schema(
  {
    id: false,
    showId: {
      type: Schema.Types.ObjectId,
      required: [true, "{PATH} is required"]
    },
    bookNowUrl: {
      type: String,
      required: [true, "{PATH} is required"]
    },
    startTime: {
      type: Date,
      required: [true, "{PATH} is required"]
    },
    showStatus:{
      type: String,
      trim: true,
      required: [true, "{PATH} is required"],
      enum: ["Now Showing", "Completed", "Cancelled"],
      default: "Now Showing"
    },
    theaterId: {
      type: Schema.Types.ObjectId,
      ref: "theaters",
      required: [true, "Theaterid cannot be set to empty"]
    },
    inactivatedDateTime: {
      type: Number,
      default: 0
    },
    deletedDateTime: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
export default model("shows", ShowsSchema);
