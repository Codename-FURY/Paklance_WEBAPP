const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project',
  },
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  proposal: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: null,
  },
  bidStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
