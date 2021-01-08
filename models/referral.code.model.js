const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RefCode = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RefCode", RefCode);
