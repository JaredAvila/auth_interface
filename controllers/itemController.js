const Item = require("../models/itemModel");
const AppError = require("../utils/AppError");

exports.getAllItems = async (req, res, next) => {
  const items = await Item.find();

  res.status(200).json({
    status: "success",
    resutls: items.length,
    data: {
      items
    }
  });
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      next(new AppError("Couldn't find item", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        item
      }
    });
  } catch (err) {
    next(new AppError(`Item not found: ${err}`, 404));
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const newItem = new Item({
      name: req.body.name,
      photo: req.body.photo,
      url: req.body.url,
      price: req.body.price,
      category: req.body.category
    });
    const item = await newItem.save();
    res.status(200).json({
      status: "success",
      data: {
        item
      }
    });
  } catch (err) {
    next(new AppError(`Could not create item: ${err}`, 400));
  }
};

exports.updateItem = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(new AppError(`Could not update item: ${err}`, 400));
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(new AppError(`Could not delete item: ${err}`, 400));
  }
};
