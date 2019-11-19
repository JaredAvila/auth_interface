const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  photo: {
    type: String,
    default: "No photo"
  },
  role: {
    type: String,
    default: "child"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  parent: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: []
  },
  balance: {
    type: Number,
    min: [0, "Amount cannot be less than 0"],
    default: 0
  }
});

const Child = mongoose.model("Child", childSchema);

module.exports = Child;
