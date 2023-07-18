const User = require("../models/userModel");
const Order = require("../models/OrderModel");

// Function to get all users with search filter and date range filter
exports.getUsersCountByDate = async (req, res) => {
    try {
        const { search = "", startDate, endDate } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else {
            const currentDate = new Date();
            const lastWeekDate = new Date();
            lastWeekDate.setDate(currentDate.getDate() - 7);
            query.createdAt = { $gte: lastWeekDate, $lte: currentDate };
            console.log(query)
        }

        const users = await User.find(query);

        res.status(200).json({
            status: "success",
            results: users.length,
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

exports.getTotalSalesAnalytics = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const query = {};
  
      if (startDate && endDate) {
        query.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
      } else {
        const currentDate = new Date();
        const lastWeekDate = new Date();
        lastWeekDate.setDate(currentDate.getDate() - 7);
        query.orderDate = { $gte: lastWeekDate, $lte: currentDate };
      }
  
      const orders = await Order.find(query);
      const totalAmount = orders.reduce((sum, order) => sum + parseInt(order.totalAmount), 0);
  
      res.status(200).json({
        status: "success",
        totalAmount,
        data: {
          orders,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };
  

  exports.getOrderCountAnalytics = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const query = {};
  
      if (startDate && endDate) {
        query.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
      } else {
        const currentDate = new Date();
        const lastWeekDate = new Date();
        lastWeekDate.setDate(currentDate.getDate() - 7);
        query.orderDate = { $gte: lastWeekDate, $lte: currentDate };
      }
  
      const orders = await Order.find(query);
  
      res.status(200).json({
        status: "success",
        totalOrders:orders.length,
        data: {
          orders,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };