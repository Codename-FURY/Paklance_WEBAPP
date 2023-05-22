const mongoose = require('mongoose');

const SchoolingSchema = new mongoose.Schema({
  yearDone: Number,
  schoolName: String,
  brief: String,
});

const GraduationSchema = new mongoose.Schema({
  yearDone: Number,
  universityName: String,
  degree: String,
  brief: String,
});

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: String,
  address: String,
  age: Number,
  about: String,
  profilePic: {
    type: String,
    default: null,
  },
  education: {
    schooling: [SchoolingSchema],
    graduation: [GraduationSchema],
  },
  experience: [
    {
      companyName: String,
      position: String,
      timeframe: String,
      brief: String,
    }
  ],
});

module.exports = mongoose.model('Profile', ProfileSchema);
