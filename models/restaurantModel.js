const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  ratings: {
    type: Number,
    default: 0
  },
  minDeliveryTime: {
    type: Number,
    required: true
  },
  maxDeliveryTime: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lat: { 
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
