const User = require("../models/userModel");

// Function to get all users with pagination and search filter
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);

        res.status(200).json({
            status: "success",
            results: users.length,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalUsers,
            data: {
                users,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};


// Function to create a new user
const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// Function to get user details by ID
const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: {
                    user,
                },
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// Function to update user details by ID
const updateUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const updatedUser = await User.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: {
                    user: updatedUser,
                },
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// Function to delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        } else {
            res.status(204).json({
                status: "success",
                data: null,
            });
        }
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    getUserDetails,
    updateUserDetails,
    deleteUser,
};
