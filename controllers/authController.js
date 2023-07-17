const User = require("./../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");


// Function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

const generateResetPasswordToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_RESET_PASSWORD_SECRET, {
      expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRY,
    });
  };
  


exports.signUp = async (req, res) => {
    try {
        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            lat: req.body.lat,
            lng: req.body.lng,
            address: req.body.address

        });
        const token = generateToken(newUser._id);

        res.status(201).json({
            status: "success",
            token: token,
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
}

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password",
            });
        }

        // Find the user by their email
        const user = await User.findOne({ email }).select("+password");

        // Check if the user exists and the password is correct
        if (!user || !(user.checkPassword(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password",
            });
        }

        const token = generateToken(user._id);

        // Send the response with the token and user data
        res.status(200).json({
            status: "success",
            token: token,
            data: {
                user: user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if the email is provided
      if (!email) {
        return res.status(400).json({
          status: "fail",
          message: "Please provide an email",
        });
      }
  
      // Find the user by their email
      const user = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }
  
      // Generate reset password token
      const resetToken = generateResetPasswordToken(user._id);
  
      // Save the reset token to the user document
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
      await user.save();
  
      // TODO: Send the reset password email with the resetToken
  
      res.status(200).json({
        status: "success",
        message: "Reset password token has been sent to the provided email",
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
  
      // Check if the reset token and new password are provided
      if (!resetToken || !newPassword) {
        return res.status(400).json({
          status: "fail",
          message: "Please provide the reset token and new password",
        });
      }
  
      // Find the user by the reset token and check if the token is still valid
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      // Check if the user exists and the token is valid
      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid or expired reset token",
        });
      }
  
      // Update the password
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      // Encrypt the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
  
      await user.save();
  
      res.status(200).json({
        status: "success",
        message: "Password has been reset successfully",
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  };
  

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if the Authorization header contains a valid token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If token is not provided
        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "Access denied. Please provide a valid token.",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user still exists in the database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "The user belonging to this token does not exist.",
            });
        }

        // Store the user in the request object
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: "Invalid token. Access denied.",
        });
    }

}