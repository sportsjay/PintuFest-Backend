const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

const mongoose = require("mongoose");
// mongoose.connect(
//   `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@escape-room-db.pjjl5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
//   { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true }
// );
mongoose.connect("mongodb://localhost:27017/escape-room-db", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});

//routes
const adminRouter = require("./routes/admin.route");
const gameRouter = require("./routes/game.route");

app.use("/admin-api", adminRouter);
app.use("/game-api", gameRouter);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
