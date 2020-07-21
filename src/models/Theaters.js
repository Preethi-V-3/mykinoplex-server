import { Schema, model } from 'mongoose';

// this will be our database's theater data structure
const TheaterSchema = new Schema(
  {
    id: false,
    theaterId: {
      type: Schema.Types.ObjectId,
      required: [true, '{PATH} must be an ObjectId and is required']
    },
    theaterName: {
      type: String,
      required: [true, "{PATH} must be a string and is required"]
    },
    inactivatedDateTime: {
      type: Number,
      default: 0
    },
    deletedDateTime: {
      type: Number,
      default: 0
    },
    address: {
      country: {
        type: String,
        required: [true, "{PATH} is required"]
      },
      city: {
        type: String,
        required: [true, "{PATH} is required"]
      },
      street: {
        type: String,
        required: [true, "{PATH} is required"]
      },
      zipcode: {
        type: Number,
        required: [true, "{PATH} is required"]
      }
    }
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
export default model(
  'theaters',
  TheaterSchema
);