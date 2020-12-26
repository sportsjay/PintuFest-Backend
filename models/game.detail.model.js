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
      unique: true,
      trim: true,
      minlength: 6,
    },
    roomNumber: {
      type: Number,
      required: true,
      unique: false,
    },
    timeStart: {
      type: Date,
      required: true,
    },
    timeEnd: {
      type: Date,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", Game);
