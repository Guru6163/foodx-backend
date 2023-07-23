const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  restaurant: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  deliveryPartner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
    name: {
      type: String,
    },
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      itemName:{
        type:String,
      }
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryCharge: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Delivered", "Cancelled"],
    default: "Pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    default: null,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
