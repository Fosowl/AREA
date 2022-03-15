const router = require("express").Router();
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const { requireUserId } = require("../middleware/auth");

router.post("/register", authController.signUp);
// router.get("/", userController.getAllUsers);
router.get("/", requireUserId, userController.userInfo);
router.put("/", requireUserId, userController.updateUser);
router.delete("/", requireUserId, userController.deleteUser);

// Authentication
router.post("/login", authController.signIn);
router.get("/confirmation/:emailToken", authController.mailConfirmation);
router.get("/logout", authController.logout);

module.exports = router;
