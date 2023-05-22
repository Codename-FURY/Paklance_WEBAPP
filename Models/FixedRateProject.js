const mongoose = require('mongoose');

const FixedRateProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: String,
  description: String,
  budget: Number,
  deadline: Date,
});

module.exports = mongoose.model('FixedRateProject', FixedRateProjectSchema);
