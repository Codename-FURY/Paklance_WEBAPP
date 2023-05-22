const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const { createError } = require("../utils/error");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Profile = require('../Models/ProfileModel');
const BankDetails = require('../Models/bankDetails');
const randomstring = require('randomstring');


// Register
const register = async (req, res, next) => {
  const { firstName, lastName, email, password,role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'User already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password,salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hash,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'jobSeeker registered successfully' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
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
// reset password
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

// Profile creation
const createProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const existingProfile = await Profile.findOne({ userId });

    if (existingProfile) {
      return res.status(409).json({ message: 'Profile already exists' });
    }
    const { name, address, age, about, schooling, graduation, experience } = req.body;

    const profile = new Profile({
      userId,
      name,
      address,
      age,
      about,
      education: {
        schooling,
        graduation,
      },
      experience,
    });

    await profile.save();

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (err) {
    next(err);
  }
};

// bank Details
const saveBankDetails = async (req, res, next) => {
  const { cardHolderName, cardNumber, expiryDate, cvc } = req.body;
  const userId = req.userId 
  const existingBankDetails  = await BankDetails.findOne({ userId });

  if (existingBankDetails) {
    return res.status(409).json({ message: 'Details already exists' });
  }
  try {
    const bankDetails = new BankDetails({
      userId,
      cardHolderName,
      cardNumber,
      expiryDate,
      cvc
    });

    await bankDetails.save();

    res.status(200).json({ message: 'Bank details saved successfully' });
  } catch (err) {
    next(err);
  }
};
// ME Api
const getME = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { role,email,firstName,lastName, ...userInfo } = user; // Extracting the 'role' field from user

    res.status(200).json({  firstName,lastName,role, email,});
  } catch (err) {
    next(err);
  }
};

// Display Profile
const displayProfile = async (req, res, next) => {
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
// Update Profile
const updateProfile = async (req, res) => {
  try {
    // Get the user ID from the request parameters
    const userId = req.userId 

    // Get the updated profile data from the request body
    const updatedProfileData = req.body;

    // Find the profile by user ID and update it with the new data
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updatedProfileData },
      { new: true }
    );

    if (!updatedProfile) {
      // If profile not found, return an error response
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Return the updated profile in the response
    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  createProfile,
  saveBankDetails,
  displayProfile,
  updateProfile,
  getME
};
