const User = require("../models/userModel");
const Order = require("../models/OrderModel");
const Restaurant = require("../models/restaurantModel");
const MenuItem = require("../models/menuModel");
const DeliveryPartner = require("../models/deliveryPartnerModel");

// Create a new order
const createOrder = async (req, res) => {
  const { user, restaurant, deliveryPartner, items, totalAmount, deliveryCharge, orderStatus, paymentMethod, paymentId } = req.body;

  try {
    // Check if the user exists
    const userExists = await User.exists({ _id: user });
    if (!userExists) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    // Check if the restaurant exists
    const restaurantExists = await Restaurant.exists({ _id: restaurant });
    if (!restaurantExists) {
      return res.status(404).json({
        status: "fail",
        message: "Restaurant not found.",
      });
    }

    // Check if the delivery partner exists
    const deliveryPartnerExists = await DeliveryPartner.exists({ _id: deliveryPartner });
    if (!deliveryPartnerExists) {
      return res.status(404).json({
        status: "fail",
        message: "Delivery partner not found.",
      });
    }

    // Check if all menu items exist
    const menuItemsExist = await MenuItem.find({ _id: { $in: items.map((item) => item.menuItem) } }).lean();
    if (menuItemsExist.length !== items.length) {
      return res.status(404).json({
        status: "fail",
        message: "One or more menu items not found.",
      });
    }

    const order = await Order.create({
      user,
      restaurant,
      deliveryPartner,
      items,
      totalAmount,
      deliveryCharge,
      orderStatus,
      paymentMethod,
      paymentId
    });

    res.status(201).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve orders.",
      error: error.message,
    });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found.",
      });
    }
    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve order.",
      error: error.message,
    });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  const { user, restaurant, deliveryPartner, items, totalAmount, deliveryCharge, orderStatus, paymentMethod, paymentId } = req.body;
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found.",
      });
    }

    // Check if the user exists
    if (user) {
      const userExists = await User.exists({ _id: user });
      if (!userExists) {
        return res.status(404).json({
          status: "fail",
          message: "User not found.",
        });
      }
    }

    // Check if the restaurant exists
    if (restaurant) {
      const restaurantExists = await Restaurant.exists({ _id: restaurant });
      if (!restaurantExists) {
        return res.status(404).json({
          status: "fail",
          message: "Restaurant not found.",
        });
      }
    }

    // Check if the delivery partner exists
    if (deliveryPartner) {
      const deliveryPartnerExists = await DeliveryPartner.exists({ _id: deliveryPartner });
      if (!deliveryPartnerExists) {
        return res.status(404).json({
          status: "fail",
          message: "Delivery partner not found.",
        });
      }
    }

    // Check if all menu items exist
    if (items) {
      const menuItemsExist = await MenuItem.find({ _id: { $in: items.map((item) => item.menuItem) } }).lean();
      if (menuItemsExist.length !== items.length) {
        return res.status(404).json({
          status: "fail",
          message: "One or more menu items not found.",
        });
      }
    }

    order.user = user || order.user;
    order.restaurant = restaurant || order.restaurant;
    order.deliveryPartner = deliveryPartner || order.deliveryPartner;
    order.items = items || order.items;
    order.totalAmount = totalAmount || order.totalAmount;
    order.deliveryCharge = deliveryCharge || order.deliveryCharge;
    order.orderStatus = orderStatus || order.orderStatus;
    order.paymentMethod = paymentMethod || order.paymentMethod;
    order.paymentId = paymentId || order.paymentId;

    await order.save();

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to update order.",
      error: error.message,
    });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found.",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to delete order.",
      error: error.message,
    });
  }
};


const searchOrdersByEmailorPhone = async (req, res) => {
  const { query } = req.query;

  try {
    // Perform the search based on email or phoneNumber
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: 'i' } }, // Case-insensitive search for email
        { phoneNumber: { $regex: query, $options: 'i' } }, // Case-insensitive search for phoneNumber
      ],
    }).select('email phoneNumber');

    // Simulate some delay to show the progress bar
    setTimeout(() => {
      res.status(200).json({
        status: 'success',
        data: users,
      });
    }, 1000); // You can adjust the delay as needed
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Failed to retrieve users.',
      error: error.message,
    });
  }
}



module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  searchOrdersByEmailorPhone
};
