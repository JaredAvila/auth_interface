const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    photo: {
      type: String,
      default: "default.jpg"
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
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A child account must have a parent"]
    },
    balance: {
      type: Number,
      min: [0, "Amount cannot be less than 0"],
      default: 0
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Child = mongoose.model("Child", childSchema);

module.exports = Child;
