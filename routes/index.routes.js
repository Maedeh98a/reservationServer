const router = require("express").Router();

router.get("/", (req, res, next) => {
  let app_version = 1;

  res.json("All good in here, app version: " + app_version);
});

module.exports = router;
