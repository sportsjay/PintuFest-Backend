const router = require("express").Router();
// import game model
let Game = require("../models/game.detail.model");

const verify = require("../function/verifyToken");

// Get Game Detail //
router.route("/").get(async (req, res) => {
  Game.find()
    .then((games) => {
      res.json(games);
    })
    .catch((error) => {
      res.status(400).json("Error fetching games details: " + error);
    });
});

// Get Game Detail Based on Name //
router.route("/:name").get(async (req, res) => {
  const name = req.params.name;
  Game.find({ name: name })
    .then((details) => {
      res.json(details);
    })
    .catch((error) =>
      res
        .status(400)
        .json("Error fetching game details based on name, " + error)
    );
});

router.route("/newgame").post(async (req, res) => {
  const id = parseInt(Math.random() * 1000);
  const name = req.body.name;
  const roomNumber = req.body.roomNumber;
  const duration = req.body.duration;
  const timeSlot = req.body.timeSlot;
  const participants = [];
  const maxNumberOfParticipants = 7;
  const status = 1;

  const newGame = new Game({
    id,
    name,
    roomNumber,
    timeSlot,
    duration,
    participants,
    maxNumberOfParticipants,
    status,
  });
  newGame
    .save()
    .then(() => res.json("new game timeslot has been added!"))
    .catch((err) => res.status(400).json("Save Error: " + err));
});

// User Book a Game //
router.route("/book").post(async (req, res) => {
  const username = req.body.username;
  // const numUser = req.body.numUser || 1; // if user wants to add more than 1 ticket for a timeslot
  const email = req.body.email;
  const gameId = req.body.gameId; // array of gameIds

  let numParticipants; // current number of participants
  let maxNumParticipants; // max number of participants

  if (username === undefined || username === "") {
    res.status(400).json("Name Required!");
    return;
  }

  if (email === undefined || email === "") {
    res.status(400).json("Email Required!");
    return;
  }

  try {
    // loop through Escape-Room game id from booking
    await Game.findOne({ id: gameId })
      .then((details) => {
        numParticipants = details.participants.length;
        maxNumParticipants = details.maxNumberOfParticipants;
      })
      .catch(
        (error) =>
          res.status(400).json(`Error querying game ${idx + 1} detail: `) +
          error
      );
    // check if slot status is fully booked
    if (numParticipants < maxNumParticipants) {
      await Game.findOneAndUpdate(
        { id: id },
        { $push: { participants: username } }
      )
        .then(() => {
          if (idx === 2) {
            // user can only book 3 slots, 1 for each respective game room
            // provide response to calculate the price
            res.json({
              msg: `You have successfully booked the slots!`,
            });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json(`Error booking slot for game ${idx + 1}: ` + error);
        });
    } else {
      res.status(400).json(`Game ${idx + 1} slot is fully booked!`);
    }
  } catch {
    (error) =>
      res.status(400).json("Error found while checking game ID, " + error);
  }
});

// Admin Update Game Status (Start, On-Progress, Reset) //
router.route("/update-status/:gameid").post(async (req, res) => {
  // add auth token
  const gameId = req.params.gameid;
  const gameStatus = req.body.gameStatus;
  const durationLeft = gameStatus === 1 ? req.body.duration : "none";

  Game.findOneAndUpdate(
    { id: gameId },
    { status: gameStatus, duration: durationLeft }
  )
    .then((details) => {
      switch (gameStatus) {
        case gameStatus === 0:
          res.json(`Game Room ${details.name}: ${details.roomNumber} Started!`);
          return;
        case gameStatus === 1:
          res.json({
            msg: `Game Room ${details.name}: ${details.roomNumber} has ${durationLeft} mins left!`,
            duration: durationLeft,
          });
          return;
        case gameStatus === 2:
          res.json(
            `Game Room ${details.name}: ${details.roomNumber} is Resetting!`
          );
          return;
        default:
          res.status(400).json("Failed to change status!");
          return;
      }
    })
    .catch((error) =>
      res.status(400).json("Failed to update game room status! " + error)
    );
});

module.exports = router;
