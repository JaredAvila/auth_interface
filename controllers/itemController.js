const Item = require("../models/itemModel");
const User = require("../models/userModel");

const AppError = require("../utils/AppError");

const catchAsync = require("../utils/catchAsync");

exports.getAllItems = catchAsync(async (req, res, next) => {
  const items = await Item.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    resutls: items.length,
    data: {
      items
    }
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    next(new AppError("Couldn't find item", 404));
  }
  if (item.user !== req.user._id.toString()) {
    return next(new AppError("This item does not belong to you", 403));
  }
  res.status(200).json({
    status: "success",
    data: {
      item
    }
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const item = new Item({
    name: req.body.name,
    photo: req.body.photo,
    url: req.body.url,
    price: req.body.price,
    category: req.body.category,
    user: req.user._id
  });
  await item.save();
  res.status(200).json({
    status: "success",
    data: {
      item
    }
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  if (
    !req.body.name &&
    !req.body.photo &&
    !req.body.url &&
    !req.body.price &&
    !req.body.category
  ) {
    return next(new AppError("No changes were made. Try again", 400));
  }
  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(new AppError("Item not found", 404));
  }
  if (req.body.name) {
    item.name = req.body.name;
  } else if (req.body.photo) {
    item.photo = req.body.photo;
  } else if (req.body.url) {
    item.url = req.body.url;
  } else if (req.body.price) {
    item.price = req.body.price;
  } else if (req.body.category) {
    item.category = req.body.category;
  }
  await item.save();
  res.status(200).json({
    status: "success",
    data: {
      item
    }
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(new AppError("Item not found", 404));
  }
  await item.deleteOne({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    data: {
      message: "Item deleted"
    }
  });
});
