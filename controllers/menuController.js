const MenuItem = require("../models/menuModel");
const Restaurant = require("../models/restaurantModel");

const createMenuItem = async (req, res) => {
  const { restaurant } = req.body;

  try {
    const restaurantExists = await Restaurant.exists({ _id: restaurant });

    if (!restaurantExists) {
      return res.status(404).json({
        status: "fail",
        message: "Restaurant not found.",
      });
    }

    const menuItem = await MenuItem.create(req.body);

    // Add the menu item ID to the corresponding restaurant's menuItems array
    await Restaurant.findByIdAndUpdate(
      restaurant,
      { $push: { menuItems: menuItem._id } },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to create menu item.",
      error: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
};




// Get all menu items
const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json({
            status: "success",
            data: menuItems,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to retrieve menu items.",
            error: error.message,
        });
    }
};

// Get a single menu item by ID
const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({
                status: "fail",
                message: "Menu item not found.",
            });
        }
        res.status(200).json({
            status: "success",
            data: menuItem,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to retrieve menu item.",
            error: error.message,
        });
    }
};

// Update a menu item
const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!menuItem) {
            return res.status(404).json({
                status: "fail",
                message: "Menu item not found.",
            });
        }
        res.status(200).json({
            status: "success",
            data: menuItem,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to update menu item.",
            error: error.message,
        });
    }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({
                status: "fail",
                message: "Menu item not found.",
            });
        }
        res.status(201).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to delete menu item.",
            error: error.message,
        });
    }
};

module.exports = {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
};
