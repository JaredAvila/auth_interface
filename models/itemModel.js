const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true
  },
  photo: String,
  url: String,
  price: {
    type: Number,
    required: [true, "Price is required"]
  },
  category: {
    type: String,
    required: [true, "Item must have a category"],
    enum: {
      values: ["toys/games", "arts/crafts", "sports/outdoor", "sweets/treats"],
      message: "This category does not exist"
    }
  },
  user: String
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
