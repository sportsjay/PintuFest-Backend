const router = require("express").Router();
const Game = require("../models/game.detail.model");

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

// User Book a Game //
router.route("/book").post(async (req, res) => {
  const gameId = req.body.gameId;
  const participant = req.body.participant;

  let numParticipants;
  let maxNumParticipants;

  // if status is pending or booked
  await Game.findOne({ id: gameId })
    .then((details) => {
      numParticipants = details.participants.length;
      maxNumParticipants = details.maxNumberOfParticipants;
    })
    .catch(
      (error) => res.status(400).json("Error querying game detail: ") + error
    );
  if (numParticipants < maxNumParticipants) {
    await Game.findOneAndUpdate(
      { id: gameId },
      { $push: { participants: participant } }
    )
      .then(() => {
        res.json({
          msg:
            "Slot successfully booked! Please wait for confirmation from the admin via e-mail, thank you for registering!",
          paymentLink:
            "https://docs.google.com/forms/d/e/1FAIpQLSdB2Jeq6VNKzL_S-J3WI6RanVVFvKPLB56SHvUTR94YHcqNmg/viewform?usp=sf_link",
        });
        // send link for payment
      })
      .catch((error) => res.status(400).json("Error booking slot: " + error));
  } else {
    res.status(400).json("The slot is fully booked!");
  }
});

module.exports = router;
