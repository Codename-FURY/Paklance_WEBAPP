const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardHolderName: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  cvc: {
    type: String,
    required: true
  }
});

module.exports  = mongoose.model('BankDetails', bankDetailsSchema);


