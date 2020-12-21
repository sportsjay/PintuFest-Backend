const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// import db
const db = require("./models/index");

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

dotenv.config();

async function initDB() {
  try {
    const sequelize = db.sequelize.sync();
    await db.sequelize.authenticate();
    console.log("Connection to DB is successful!");
  } catch (error) {
    console.error("Unable to connect to DB");
    console.error(error);
  }
}

//connect to DB
initDB();

//routes
const testRoute = require("./routes/test.route");

app.use("/test", testRoute);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
