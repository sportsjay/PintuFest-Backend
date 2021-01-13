const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Room = new Schema(
  {
    room: {
      type: Number, // room 1, 2, 3
      required: true,
    },
    status: {
      type: Number, // progress status of the room: 1 = preparing, 2 = on-progress, 3 = resetting
      required: true,
    },
    duration: {
      // time keeper purpose (120 mins, 60 mins, 30 mins, 10 mins, 5 mins, 2 mins, 1 min)
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", Room);
