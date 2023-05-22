const bcrypt = require("bcryptjs");
const User = require('../Models/UserModel');
const { createError } = require('../utils/error');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const { generate } = require("randomstring");

const registerAdmin = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      throw createError(409, 'Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    next(err);
  }
};

const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, 'User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createError(401, 'Incorrect password');
    }

    const payload = {
      userId: user._id,
      role: user.role, // Assuming the user role is stored in the "role" field of the user document
    };

    const token = jwt.sign(payload, process.env.JWT_SECRETKEY);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

//Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      const randomString = randomstring.generate();
      const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
      sendresetPasswordMail(userData.name, userData.email, randomString);
      res.status(200).send({ success: true, message: "Please check your email inbox to reset your password" });
    } else {
      res.status(200).send({ success: true, message: "This email does not exist!" });
    }
  } catch (err) {
    next(err);
  }
};

const sendresetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.emailAdmin,
        pass: process.env.emailPassword,
      }
    });

    const mailOptions = {
      from: process.env.emailAdmin,
      to: email,
      subject: 'For Password Reset',
      html: '<p> Hi ' + name + ', please click on the link <a href="http://127.0.0.1:7000/admin/resetpassword?token=' + token + '">to reset your password </a>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Mail has been sent', info.response);
      }
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    const userdata = await User.findOne({ token });
    if (!userdata) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      userdata.password = hashedPassword;
      userdata.token = "";
      await userdata.save();

      res.status(200).json({ success: true, message: 'Password updated successfully' });
    }
  } catch (err) {
    next(err);
  }
};
// Admin Profile
const adminProfile = async (req, res, next) => {
  try {
    const userId = req.userId 

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  adminProfile,
  forgotPassword,
  resetPassword
};






