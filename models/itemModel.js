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
  category: String
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
