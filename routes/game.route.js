const router = require("express").Router();
// import game model
let Game = require("../models/game.detail.model");

// test api //
router.route("/testing").get(async (req, res) => {
  res.json("I am queried!");
});

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
  const usernames = req.body.usernames; // number of tickets booked by a user by mapping the same username
  // const email = req.body.email;
  const gameId = req.body.gameId; // array of gameIds

  let numParticipants; // current number of participants
  let maxNumParticipants; // max number of participants
  let timeslot;
  if (username === undefined || username === "") {
    return res.status(400).json("Name Required!");
  }
  // loop through Escape-Room game id from booking
  await Game.findOne({ id: parseInt(gameId) })
    .then((details) => {
      numParticipants = details.participants.length;
      maxNumParticipants = details.maxNumberOfParticipants;
      timeslot = details.timeSlot;
      if (usernames.length > maxNumParticipants - numParticipants) {
        console.log(
          `Failed to book! not enough slot to book! tried to book ${
            usernames.length
          }, ${maxNumParticipants - numParticipants} slots left`
        );
        return res
          .status(400)
          .json(
            `Failed to book! not enough slot to book! tried to book ${
              usernames.length
            }, ${maxNumParticipants - numParticipants} slots left`
          );
      }
    })
    .catch((error) => {
      let date = new Date();
      console.log(`${date}: Error querying game ${idx + 1}`);
      res.status(400).json(`Error querying game ${idx + 1} detail: ` + error);
    });
  // Check for more than 1 user booking
  if (
    usernames.length <= maxNumParticipants - numParticipants &&
    usernames.length > 0
  ) {
    usernames.map(async (user, idx) => {
      await Game.findOneAndUpdate(
        { id: gameId },
        { $push: { participants: user } }
      )
        .then(() => {
          let date = new Date();
          console.log(`${date}: ${user} has booked timeslot ${timeslot}`);
          if (idx === usernames.length - 1) {
            return res.json(`Thank you for booking!`);
          }
        })
        .catch((error) => {
          console.log("Failed to book! " + error);
          return res.status(400).json("Failed to book! " + error);
        });
    });
  }
});

module.exports = router;
