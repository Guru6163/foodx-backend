const User = require("../models/userModel");
const Order = require("../models/OrderModel");
const Restaurant = require("../models/restaurantModel");
const MenuItem = require("../models/menuModel");
const DeliveryPartner = require("../models/deliveryPartnerModel");

// Create a new order
const createOrder = async (req, res) => {
  const { user, restaurant, deliveryPartner, items, totalAmount, deliveryCharge, orderStatus, paymentMethod, paymentId } = req.body;

  try {

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
    const menuItemsExist = await MenuItem.find({ _id: { $in: items.map((item) => item.menuItem) } }).lean();
    if (menuItemsExist.length !== items.length) {
      return res.status(404).json({
        status: "fail",
        message: "One or more menu items not found.",
      });
    }

    const userDoc = await User.findById(user).lean();
    const restaurantDoc = await Restaurant.findById(restaurant).lean();
    let deliveryPartnerDoc
    if (deliveryPartner) {
      deliveryPartnerDoc = await DeliveryPartner.findById(deliveryPartner).lean();
    }


    const order = await Order.create({
      user: {
        id: user,
        name: userDoc.firstName + " " + userDoc.lastName, // Assuming that the user's first name is stored in the "firstName" field
      },
      restaurant: {
        id: restaurant,
        name: restaurantDoc?.name,
      },
      deliveryPartner: {
        id: deliveryPartner,
        name: deliveryPartnerDoc?.name,
      },
      items,
      totalAmount,
      deliveryCharge,
      orderStatus,
      paymentMethod,
      paymentId,
      finalAmount: parseInt(totalAmount) + parseInt(deliveryCharge)
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

// Get all orders in descending order of createdAt (most recent first)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });

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
    const userId = order?.user?.id
    const deliveryPartnerId = order?.deliveryPartner?.id
    const restaurantId = order?.restaurant?.id

    const user = await User.findById(userId)
    const restaurant = await Restaurant.findById(restaurantId)
    const deliveryPartner = await User.findById(deliveryPartnerId)


    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found.",
      });
    }
    res.status(200).json({
      status: "success",
      data: { order, deliveryPartner, restaurant, user },
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
  const { user, restaurant, deliveryPartner, items, totalAmount, deliveryCharge, orderStatus, paymentMethod, paymentId, finalAmount } = req.body;
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

    const userDoc = await User.findById(user).lean();
    const restaurantDoc = await Restaurant.findById(restaurant).lean();
    let deliveryPartnerDoc
    if (deliveryPartner) {
      deliveryPartnerDoc = await DeliveryPartner.findById(deliveryPartner).lean();
    }
    order.user = {
      id: user || order.user.id,
      name: user ? `${userDoc.firstName} ${userDoc.lastName}` : order.user.name,
    };
    order.restaurant = {
      id: restaurant || order.restaurant.id,
      name: restaurant ? restaurantDoc?.name : order.restaurant.name,
    };
    order.deliveryPartner = {
      id: deliveryPartner || order.deliveryPartner?.id,
      name: deliveryPartner ? deliveryPartnerDoc?.name : order.deliveryPartner?.name,
    };
    order.items = items || order.items;
    order.totalAmount = totalAmount || order.totalAmount;
    order.deliveryCharge = deliveryCharge || order.deliveryCharge;
    order.orderStatus = orderStatus || order.orderStatus;
    order.paymentMethod = paymentMethod || order.paymentMethod;
    order.paymentId = paymentId || order.paymentId;
    order.finalAmount = totalAmount + deliveryCharge || order.totalAmount + order.deliveryCharge

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
