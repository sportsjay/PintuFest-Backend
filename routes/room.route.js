const router = require("express").Router();
let Room = require("../models/room.model");

const verify = require("../function/verifyToken");

router.route("/create-room/").post(async (req, res) => {
  const room = req.body.room;
  const status = 1;
  const duration = "0 min";

  const newRoom = new Room({
    room,
    status,
    duration,
  });
  newRoom
    .save()
    .then(() => {
      console.log("successfully created room");
      res.json(`Room ${room} has been created!`);
    })
    .catch((error) => {
      console.log("Failed creating room!" + error);
      res.status(400).json("Failed creating room!");
    });
});

// Get Room Time Status //
router.route("/get-status/:gameRoom").get(async (req, res) => {
  const gameRoom = req.params.gameRoom;
  const date = new Date();
  Room.findOne({ room: gameRoom }).then((details) => {
    console.log(`${date}: Room ${gameRoom} details`);
    res.json(details.duration);
  });
});

// Admin Update Game Status (Start, On-Progress, Reset) //
router.route("/update-status/:gameRoom").post(async (req, res) => {
  // add auth token
  const gameRoom = req.params.gameRoom;
  const gameStatus = req.body.gameStatus;
  const durationLeft = req.body.duration;
  const date = new Date();

  Room.findOneAndUpdate(
    { room: gameRoom },
    { status: gameStatus, duration: durationLeft }
  )
    .then((details) => {
      switch (gameStatus) {
        case gameStatus === 0:
          res.json(`Game Room ${details.name}: ${details.roomNumber} Started!`);
          console.log(
            `${date}: Game Room ${details.name}: ${details.roomNumber} Started!`
          );
          return;
        case gameStatus === 1:
          res.json({
            msg: `Game Room ${details.name}: ${details.roomNumber} has ${durationLeft} mins left!`,
            duration: durationLeft,
          });
          console.log(
            `${date}: Game Room ${details.name}: ${details.roomNumber} has ${durationLeft} mins left!`
          );
          return;
        case gameStatus === 2:
          res.json(
            `Game Room ${details.name}: ${details.roomNumber} is Resetting!`
          );
          console.log(
            `${date}: Game Room ${details.name}: ${details.roomNumber} is Resetting!`
          );
          return;
        default:
          res.status(400).json("Failed to change status!");
          console.log(`${date}: Error! Failed to change game status!`);
          return;
      }
    })
    .catch((error) =>
      res.status(400).json("Failed to update game room status! " + error)
    );
});

module.exports = router;
