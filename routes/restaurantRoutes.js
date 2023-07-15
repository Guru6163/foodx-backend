const express = require("express")
const restaurantsControllers = require("../controllers/restaurantsController")

const router = express.Router()



router.route("/")
    .get(restaurantsControllers.getAllRestaurants)
    .post(restaurantsControllers.createRestaurants)


router.route("/:id")
    .get(restaurantsControllers.getRestaurantDetails)
    .patch(restaurantsControllers.updateRestaurantDetails)
    .delete(restaurantsControllers.deleteRestaurant)

module.exports = router