const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true
    },
    photo: {
      type: String,
      default: "default.jpg"
    },
    url: String,
    price: {
      type: Number,
      required: [true, "Price is required"]
    },
    category: {
      type: String,
      required: [true, "Item must have a category"],
      enum: {
        values: [
          "toys/games",
          "arts/crafts",
          "sports/outdoor",
          "sweets/treats"
        ],
        message: "This category does not exist"
      }
    },
    child: {
      type: mongoose.Schema.ObjectId,
      ref: "Child",
      required: [true, "An item must belong to a child"]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Item must belong to a parent"]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

itemSchema.pre(/^find/, function(next) {
  this.populate({
    path: "child",
    select: "name photo"
  });
  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
