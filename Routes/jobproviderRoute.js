const express = require("express");
const router = express.Router();
const jobprovider_controller = require("../Controllers/jobproviderController");
const {verifyJobProviderToken,verifyToken} = require("../utils/verifyToken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadProfilePicture } = require('../Controllers/profileController');
const project_controller = require('../Controllers/ProjectController');






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
router.post("/register",jobprovider_controller.register);
router.post("/login",jobprovider_controller.login);
router.post('/forgotpassword',jobprovider_controller.forgotPassword);
router.put('/resetpassword/:token',jobprovider_controller.resetPassword);
router.post('/createProfile',verifyToken,jobprovider_controller.createProfile);
router.post('/addbankDetails',verifyToken,jobprovider_controller.saveBankDetails);
router.get('/getME', verifyToken, jobprovider_controller.getME);
router.get('/displayProfile', verifyJobProviderToken, jobprovider_controller.displayProfile);
router.put('/updateProfile', verifyJobProviderToken, jobprovider_controller.updateProfile);
router.post("/createproject",verifyJobProviderToken,project_controller.createProject);
router.put("/updateproject/:id",verifyJobProviderToken,project_controller.updateProject);
router.get('/showallproject', verifyToken,project_controller.showallProjects);
router.get('/showprojectbyID/:id',verifyToken, project_controller.showprojectbyID);
router.delete('/deleteprojectbyID/:id',verifyJobProviderToken,project_controller.deleteProject);

// fixed rate Project Routes
router.post("/createfixedrateproject",verifyJobProviderToken,project_controller.createFixedRateProject);
router.put("/updatefixedrateproject/:id",verifyJobProviderToken,project_controller.updateFixedRateProject);
router.get('/showallfixedrateproject', verifyToken,project_controller.getAllFixedRateProjects);
router.get('/showfixedrateprojectbyID/:id',verifyToken, project_controller.getFixedRateProjectById);
router.delete('/deletefixedrateprojectbyID/:id',verifyJobProviderToken,project_controller.deleteFixedRateProject);


module.exports = router ;