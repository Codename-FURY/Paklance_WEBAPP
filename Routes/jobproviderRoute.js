const express = require('express');
const router = express.Router();
const { verifyJobProviderToken, verifyToken } = require('../utils/verifyToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadProfilePicture } = require('../Controllers/profileController');
const jobprovider_controller = require('../Controllers/jobproviderController');
const project_controller = require('../Controllers/ProjectController');

// Set up Multer storage for profile picture
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagePath = path.join(__dirname, '..', 'public', 'profile-pictures');
    fs.mkdirSync(imagePath, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const userId = req.userId;
    const filename = `${userId}-${file.originalname}`;
    cb(null, filename);
  },
});

// Set up Multer storage for project picture
const projectPictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'public/project-pictures';
    fs.mkdirSync(folder, { recursive: true }); // Create the destination folder if it doesn't exist
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const title = req.body.title || 'untitled'; // Use a default value if req.body.title is undefined
    const filename = `${title.replace(/\s+/g, '-')}${extname}`;
    cb(null, filename);
  },
});

// Create Multer instance for profile picture
const uploadProfilePictureMiddleware = multer({ storage: profilePictureStorage }).single('profilePic');

// Create Multer instance for project picture
const uploadProjectPictureMiddleware = multer({
  storage: projectPictureStorage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG file uploads are allowed.'));
    }
  },
}).single('picture');

// Routes
router.put('/upload-profile-picture', verifyToken, uploadProfilePictureMiddleware);
router.post('/register', jobprovider_controller.register);
router.post('/login', jobprovider_controller.login);
router.post('/forgotpassword', jobprovider_controller.forgotPassword);
router.put('/resetpassword/:token', jobprovider_controller.resetPassword);
router.post('/createProfile', verifyToken, jobprovider_controller.createProfile);
router.post('/addbankDetails', verifyToken, jobprovider_controller.saveBankDetails);
router.get('/getME', verifyToken, jobprovider_controller.getME);
router.get('/displayProfile', verifyJobProviderToken, jobprovider_controller.displayProfile);
router.put('/updateProfile', verifyJobProviderToken, jobprovider_controller.updateProfile);

// Project Management Route

router.post('/createProject', verifyJobProviderToken,uploadProjectPictureMiddleware, project_controller.createProject);
router.put("/updateProject/:id", uploadProjectPictureMiddleware,project_controller.updateProject);
router.get("/getallProjects", project_controller.getallProjects);
router.get("/getProjectById/:id", project_controller.getProjectById);
router.delete("/deleteProject/:id", project_controller.deleteProject);

// BID 
const bid_controller = require("../Controllers/bidController");
router.put('/changebidstatus/:bidId',verifyJobProviderToken,bid_controller.updateBidStatus);
module.exports = router;
