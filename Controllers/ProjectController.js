const JobProject = require("../Models/HourlyJobProjects");
const { createError } = require("../utils/error");
const FixedRateProject = require("../Models/FixedRateProject");
// Create a hourly job project
const createProject = async (req, res, next) => {
    try {
      const { title, description, duration, budget } = req.body;
      const userId = req.userId;
  
      const jobProject = new JobProject({
        userId,
        title,
        description,
        duration,
        budget,
      });
  
      const savedJobProject = await jobProject.save();
  
      res.status(201).json(savedJobProject);
    } catch (err) {
      next(err);
    }
};

// Show All hourly job projects
const showallProjects = async (req, res, next) => {
    try {
      const userId = req.userId;
      console.log(userId);
      const jobProjects = await JobProject.find({ userId });
  
      res.json(jobProjects);
    } catch (err) {
      next(err);
    }
};

// Showl one based on ID 
const showprojectbyID = async (req, res, next)  => {
    try {
      const userId = req.userId;
      const jobId = req.params.id;
      const jobProject = await JobProject.findOne({ _id: jobId, userId });
  
      if (!jobProject) {
        return res.status(404).json({ message: 'Job project not found' });
      }
  
      res.json(jobProject);
    } catch (err) {
      next(err);
    }
  };

// Update a Job Project
const updateProject = async (req, res, next)  => {
    try {
      const userId = req.userId;
      const jobId = req.params.id;
  
      const { title, description, duration, budget } = req.body;
  
      const jobProject = await JobProject.findOneAndUpdate(
        { _id: jobId, userId },
        { title, description, duration, budget },
        { new: true }
      );
  
      if (!jobProject) {
        return res.status(404).json({ message: 'Job project not found' });
      }
  
      res.json(jobProject);
    } catch (err) {
      next(err);
    }
  };

// Delete by ID
const deleteProject = async (req, res, next)  => {
    try {
      const userId = req.userId;
      const jobId = req.params.id;
  
      const deletedJobProject = await JobProject.findOneAndDelete({ _id: jobId, userId });
  
      if (!deletedJobProject) {
        return res.status(404).json({ message: 'Job project not found' });
      }
  
      res.json("Project Deleted");
    } catch (err) {
      next(err);
    }
  };

  //////////////////////////////////////
  // 
  // Fixed Rate Controllers
  //
  /////////////////////////////////////

  // CREATE
  const createFixedRateProject = async (req, res, next) => {
    try {
      const userId = req.userId;
      const { title, description, budget, deadline } = req.body;
  
      const project = new FixedRateProject({
        userId,
        title,
        description,
        budget,
        deadline,
      });
  
      await project.save();
  
      const hoursToDeadline = (deadline - Date.now()) / (1000 * 60 * 60); // Calculate remaining hours to deadline
  
      setTimeout(async () => {
        await FixedRateProject.findByIdAndDelete(project._id); // Delete the project after the specified hours
  
        console.log('Project deleted:', project._id);
      }, hoursToDeadline * 60 * 60 * 1000);
  
      res.status(201).json({ message: 'Project created successfully', project });
    } catch (err) {
      next(err);
    }
  };

  // SHOW ALL
const getAllFixedRateProjects = async (req, res, next) => {
    try {
      const  userId  = req.userId;
      const fixedRateProjects = await FixedRateProject.find({ userId });
  
      res.json(fixedRateProjects);
    } catch (err) {
      next(err);
    }
  }; 

  // UPDATE 
  const updateFixedRateProject = async (req, res, next) => {
    try {
      const  projectId  = req.params.id;
      const { title, description, budget, deadline } = req.body;
  
      const updatedProject = await FixedRateProject.findByIdAndUpdate(
        projectId,
        { title, description, budget, deadline },
        { new: true }
      );
  
      res.json(updatedProject);
    } catch (err) {
      next(err);
    }
  }; 

  // DELETE
  const deleteFixedRateProject = async (req, res, next) => {
    try {
      const  projectId  = req.params.id;
  
      await FixedRateProject.findByIdAndDelete(projectId);
  
      res.json({ message: 'Project deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  // GET BY ID
  const getFixedRateProjectById = async (req, res, next) => {
    try {
      const  projectId  = req.params.id;
  
      const project = await FixedRateProject.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.json(project);
    } catch (err) {
      next(err);
    }
  };
  module.exports={
    createProject,
    deleteProject,
    updateProject,
    showprojectbyID,
    showallProjects,
    getFixedRateProjectById,
    deleteFixedRateProject,
    updateFixedRateProject,
    getAllFixedRateProjects,
    createFixedRateProject
  }
  