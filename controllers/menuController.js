const MenuItem = require("../models/menuModel");
const Restaurant = require("../models/restaurantModel");

const createMenuItem = async (req, res) => {
    const { restaurantId } = req.body;
    console.log(req.body)
    try {
        const restaurantExists = await Restaurant.exists({ _id: restaurantId });

        if (!restaurantExists) {
            return res.status(404).json({
                status: "fail",
                message: "Restaurant not found.",
            });
        }

        const menuItem = await MenuItem.create(req.body);
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




const getAllMenuItems = async (req, res) => {
    try {
        const { restaurantId } = req.body;
        console.log(restaurantId)
        if (!restaurantId) {
            return res.status(400).json({
                status: "fail",
                message: "restaurantId is required in the request body.",
            });
        }

        // Query the menu items with the specified restaurantId
        const menuItems = await MenuItem.find({ restaurantId: restaurantId });

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
