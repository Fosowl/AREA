const router = require("express").Router();
const areaController = require("../controllers/area");

router.get("/", areaController.hello);

module.exports = router;
