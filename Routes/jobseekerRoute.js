const express = require("express");
const router = express.Router();
const jobseeker_controller = require("../Controllers/jobseekerController");
const { verifyJobSeekerToken, verifyToken } = require("../utils/verifyToken");
const cv_controller = require("../Controllers/cvController");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadProfilePicture } = require('../Controllers/profileController');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagePath = path.join(__dirname, '..', 'public', 'profile-pictures');

    // Create the directory if it doesn't exist
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }

    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const userId = req.userId;
    const filename = `${userId}-${file.originalname}`;
    cb(null, filename);
  },
});

// Create a Multer instance
const upload = multer({ storage });

// Add the uploadProfilePicture route with Multer middleware
router.put('/upload-profile-picture', verifyToken, upload.single('profilePic'), uploadProfilePicture);

// Rest of the routes
router.post("/register", jobseeker_controller.register);
router.post("/login", jobseeker_controller.login);
router.post('/forgotpassword', jobseeker_controller.forgotPassword);
router.put('/resetpassword/:token', jobseeker_controller.resetPassword);
router.post('/createProfile', verifyToken, jobseeker_controller.createProfile);
router.post('/addbankDetails', verifyToken, jobseeker_controller.saveBankDetails);
router.get('/getProfile', verifyJobSeekerToken, jobseeker_controller.getProfile);
router.get('/cvGenerate', verifyJobSeekerToken, cv_controller.generateCV);
router.put('/updateProfile', verifyJobSeekerToken,  jobseeker_controller.updateProfile);
module.exports = router;
