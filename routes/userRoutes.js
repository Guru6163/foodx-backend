const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")

const router = express.Router()

router.post("/signup",authController.signUp)
router.post("/signin",authController.signIn)

router.route("/")
    .get(authController.protect,userController.getAllUsers)
    .post(userController.createUser)

router.route("/:id")
    .get(userController.getUserDetails)
    .patch(userController.updateUserDetails)
    .delete(userController.deleteUser)

module.exports = router


