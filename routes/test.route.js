const router = require("express").Router();
const Test = require("../models/test");

router.route("/").get((req, res) => {
  Test.findAll()
    .then((items) => {
      console.log(items);
      res.send(200);
    })
    .catch((err) => {
      console.error(err);
      res.send(400).json(err);
    });
});

module.exports = router;
