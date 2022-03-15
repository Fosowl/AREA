const router = require("express").Router();

require("../passport-setup");
const twitterRoutes = require("./auth/twitter");
const googleRoutes = require("./auth/google");
const gmailRoutes = require("./auth/gmail");
const calendarRoutes = require("./auth/calendar");
const driveRoutes = require("./auth/drive");

router.use('/twitter', twitterRoutes);
router.use('/google', googleRoutes);
router.use('/gmail', gmailRoutes);
router.use('/calendar', calendarRoutes);
router.use('/drive', driveRoutes);

module.exports = router;