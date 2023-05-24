const mongoose = require('mongoose');

// Define the Project schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    enum: ['Hourly Project', 'Fixed Price Contract'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deadline: {
    type: Number,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Create the Project model
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
