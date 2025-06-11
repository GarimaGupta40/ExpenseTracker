const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date
  }
}, { timestamps: true });


module.exports = mongoose.model('savings', savingsSchema);