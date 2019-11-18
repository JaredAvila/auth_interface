const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  photo: {
    type: String
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
  }
});

const Child = mongoose.model("Child", childSchema);

module.exports = Child;
