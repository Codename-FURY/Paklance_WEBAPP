const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const dotenv = require("dotenv");
const jobseekerRoute = require("./Routes/jobseekerRoute");
const jobproviderRoute = require("./Routes/jobproviderRoute");
const adminRoute = require("./Routes/adminRoute");
const path = require('path');
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use('/profile-pictures', express.static('public/profile-pictures'));
app.use('/project-pictures', express.static('public/project-pictures'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// middlewares
app.use(bodyParser.json());
app.use('/seeker', jobseekerRoute);
app.use('/provider', jobproviderRoute);
app.use('/admin', adminRoute);
app.use((err, req, res, next) => {
  errStatus = err.status || 500;
  errMessage = err.message || 500;
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

//port
app.listen(process.env.PORT, () => {
  console.log('Server started on port', process.env.PORT);
});
