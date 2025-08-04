import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: false, // area is optional
  },
  coordinates: {
    type: [Number], // [latitude, longitude]
    required: true,
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length === 2;
      },
      message: "Coordinates must be an array of [latitude, longitude]",
    },
  },
});

export default mongoose.model("Location", locationSchema);