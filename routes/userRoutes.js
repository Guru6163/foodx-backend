const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")
const analyticsController = require("../controllers/analyticsController")

const router = express.Router()

router.post("/signup",authController.signUp)
router.post("/signin",authController.signIn)
router.get("/get-users-count",analyticsController.getUsersCountByDate)
router.get("/get-orders-count",analyticsController.getOrderCountAnalytics)
router.get("/get-order-sales",analyticsController.getTotalSalesAnalytics)
router.get("/get-paymentMethod-data",analyticsController.getPaymentMethodAnalytics)

router.route("/")
    .get(authController.protect,userController.getAllUsers)
    .post(userController.createUser)

router.route("/:id")
    .get(userController.getUserDetails)
    .patch(userController.updateUserDetails)
    .delete(userController.deleteUser)

module.exports = router


