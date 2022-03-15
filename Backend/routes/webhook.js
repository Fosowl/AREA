
const router = require("express").Router();
const twitterWebhookController = require("../controllers/webhooks/twitter");
const gmailWebhookController = require("../controllers/webhooks/gmail");
const calendarWebhookController = require("../controllers/webhooks/calendar");
const driveWebhookController = require("../controllers/webhooks/drive");

router.get("/twitter", twitterWebhookController.get_webhook);
router.post("/twitter", twitterWebhookController.post_webhook);
router.post("/gmail", gmailWebhookController.webhook);
router.post("/calendar/event", calendarWebhookController.webhook_event);
router.post("/calendar/calendar_list", calendarWebhookController.webhook_calendar_list);
router.post("/drive/changes", driveWebhookController.webhook_changes);

module.exports = router;