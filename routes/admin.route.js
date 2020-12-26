const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verify = require("../function/verifyToken");

const {
  registerValidation,
  loginValidation,
} = require("../function/validation");

let Admin = require("../models/admin.user.model");
let Game = require("../models/admin.user.model");

// Get all users //
router.route("/").get((req, res) => {
  Admin.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

// Get admin with id //
router.route("/:id").get(verify, (req, res) => {
  adminId = req.params.id;
  Admin.find({ id: adminId })
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Admin Login //
router.route("/login").post(async (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];
  //Validate data
  const { error } = loginValidation({
    username: username,
    password: password,
  });
  if (error) return res.status(400).send(error.details[0].message);

  //Check if user exist
  await Admin.findOne({ username: username })
    .then(async (user) => {
      if (!user) return res.status(400).send("Invalid Username");

      //Password decrypt
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return res.status(400).send("Invalid Password");

      //Create and assign a token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.TOKEN_SECRET
      );
      res.header("auth-token", token);
      return res.json({
        notification: "Login Successful!",
        token: token,
      });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Admin Logout //
router.route("/logout").post(async (req, res) => {
  req.header("auth-token", "");
  return res.json("Logout successful!");
});

// Register Admin //
router.route("/register").post(async (req, res) => {
  const id = Math.floor(Math.random() * 10000);
  const username = req.body.username;
  const password = req.body.password;

  // Validation
  const { error } = registerValidation({
    username: username,
    password: password,
  });
  if (error)
    return res.status(400).send("Register Error: " + error.details[0].message);

  // Check username exists
  Admin.findOne({ username: username })
    .then((user) => {
      if (user)
        return res
          .status(400)
          .send("Username exists! Choose a new unique username");
    })
    .catch((err) => res.status(400).json(err));

  // Password Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAdmin = new Admin({
    id,
    username,
    password: hashedPassword,
  });

  newAdmin
    .save()
    .then(() => res.json("admin added!"))
    .catch((err) => res.status(400).json("Save Error: " + err));
});

// Confirm User Booking by Admin //
router.route("/confirm").post(verify, async (req, res) => {
  const gameId = req.body.gameId;
  await Game.findOne({ id: gameId }).then(() => {});
});

module.exports = router;
