const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Game = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roomNumber: {
      type: Number,
      required: true,
      unique: false,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    duration: {
      // time keeper purpose (60 mins, 30 mins, 10 mins, 5 mins, 2 mins, 1 min)
      type: Number,
      required: true,
    },
    participants: {
      type: Array,
      required: true,
    },
    maxNumberOfParticipants: {
      type: Number,
      required: true,
    },
    status: {
      type: Number, // progress status of the room: 1 = preparing, 2 = on-progress, 3 = resetting
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", Game);
