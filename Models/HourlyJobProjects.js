const mongoose = require('mongoose');

const JobProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  // Additional fields
  // ...
});

module.exports = mongoose.model('JobProject', JobProjectSchema);
