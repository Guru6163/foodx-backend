const express = require("express")
const userController = require("../controllers/userController")

const router = express.Router()


router.route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser)

router.route("/:id")
    .get(userController.getUserDetails)
    .patch(userController.updateUserDetails)
    .delete(userController.deleteUser)

module.exports = router


