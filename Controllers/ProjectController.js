const { createError } = require("../utils/error");
const Project = require("../Models/Project")
const sharp = require("sharp"); // Required for image resizing
const fs = require('fs');
const multer = require('multer');

// Create a new project
const createProject = async (req, res, next) => {
  try {
    const projectPic = req.file;
    const providerId = req.userId;
    const projectType = req.body.projectType;
    let deadline = req.body.deadline;

    // Construct the full path URL
    const baseUrl = `http://localhost:7000/project-pictures/`;

    // Resize the image
    const resizedImage = await sharp(projectPic.path)
      .resize(200) // Adjust the desired size as per your requirement
      .toBuffer();

    // Save the resized image with the correct filename
    const resizedFilename = `resized-${projectPic.filename}`;
    await sharp(resizedImage).toFile(`public/project-pictures/${resizedFilename}`);

    // Convert the deadline based on the project type
    let deadlineInSeconds;
    if (projectType === 'Fixed Price Contract') {
      // Treat deadline as the number of days and convert it to hours
      const days = parseInt(deadline);
      deadlineInSeconds = days * 24 * 3600; // Convert days to seconds
    } else if (projectType === 'Hourly Project') {
      // Treat deadline as the number of hours
      const hours = parseInt(deadline);
      deadlineInSeconds = hours * 3600; // Convert hours to seconds
    }

    // Create the project record with the resized image URL, converted deadline, and formatted deadline
    const project = new Project({
      provider: providerId,
      title: req.body.title,
      description: req.body.description,
      projectType: projectType,
      price: req.body.price,
      deadline: deadlineInSeconds, // Assign the converted deadline in seconds
      picture: baseUrl + resizedFilename // Set the resized image URL for frontend display
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};




// Update an existing project
const updateProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const projectUpdates = req.body;
    const projectPic = req.file;

    // Construct the full path URL
    const baseUrl = `http://localhost:7000/project-pictures/`;

    if (projectPic) {
      // Resize the image
      const resizedImage = await sharp(projectPic.path)
        .resize(200) // Adjust the desired size as per your requirement
        .toBuffer();

      // Save the resized image with the correct filename
      const resizedFilename = `resized-${projectPic.filename}`;
      await sharp(resizedImage).toFile(`public/project-pictures/${resizedFilename}`);

      // Update the project record with the resized image URL
      projectUpdates.picture = baseUrl + resizedFilename; // Set the resized image URL for frontend display
    }

    const project = await Project.findByIdAndUpdate(projectId, projectUpdates, { new: true });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};


// Get a specific project by ID
const getallProjects = async (req, res) => {
  try {
    const project = await Project.find();
    if (!project) {
      return res.status(404).json({ error: 'Projects not found' });
    }
    res.json(project);
  }catch (err) {
    next(err);
  }
}
// Get a specific project by ID
const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  }catch (err) {
    next(err);
  }
}

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProject,
  updateProject,
  getallProjects,
  getProjectById,
  deleteProject
};
