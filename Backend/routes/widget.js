const router = require("express").Router();
const widgetController = require("../controllers/widget");

router.get("/", widgetController.get_all_widgets);
router.get("/:id", widgetController.get_widget_info);
router.post("/add", widgetController.add_widget);
router.post("/:id", widgetController.update_widget);
router.delete("/:id", widgetController.delete_widget);

module.exports = router;