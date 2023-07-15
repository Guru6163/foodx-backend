// Function to get all restaurants
const Restaurant = require("../models/restaurantModel")


exports.getAllRestaurants = async (req, res) => {
    try {
        const newRestaurant = await Restaurant.find()
        res.status(201).json({
            status: "success",
            results: newRestaurant.length,
            data: {
                restaurants: newRestaurant
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.getRestaurantDetails = async (req, res) => {
    try {
      const restaurantDetails = await Restaurant.findById(req.params.id);
      res.status(200).json({
        status: "success",
        data: {
          restaurant: restaurantDetails,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };
  

// Function to create a new restaurant
exports.createRestaurants = async (req, res) => {
    try {
        const newRestaurant = await Restaurant.create(req.body)
        res.status(201).json({
            status: "success",
            data: {
                restaurant: newRestaurant
            }
        })
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }

}

// Function to update restaurant details by ID
exports.updateRestaurantDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
  
      res.status(200).json({
        status: "success",
        data: {
          restaurant: updatedRestaurant,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };
  
  // Function to delete a restaurant by ID
  exports.deleteRestaurant = async (req, res) => {
    try {
      const { id } = req.params;
      await Restaurant.findByIdAndDelete(id);
      res.status(201).json({
        status: "success",
        data: null,
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };
  

