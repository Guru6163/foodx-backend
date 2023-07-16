const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Regular expression to validate email format
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  lat: {
    type: String,
  },
  lng: {
    type: String,
  },

});

const User = mongoose.model("User", userSchema);

module.exports = User;
