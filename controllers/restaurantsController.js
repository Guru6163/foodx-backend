const Restaurant = require("../models/restaurantModel");

// Function to get all restaurants with optional filtering, sorting, and pagination
exports.getAllRestaurants = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["sort", "limit", "fields", "page"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = Restaurant.find(queryObj).skip(skip).limit(limit);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const restaurants = await query;

    res.status(200).json({
      status: "success",
      results: restaurants.length,
      page,
      limit,
      data: {
        restaurants,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

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

exports.createRestaurants = async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        restaurant: newRestaurant,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateRestaurantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

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

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.status(204).json({
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
