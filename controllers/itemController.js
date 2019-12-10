const Item = require("../models/itemModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const factory = require("./handlerFactory");

exports.setChildUserIds = (req, res, next) => {
  if (!req.body.child) req.body.child = req.params.childId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.verifyUser = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item || item.user.toString() !== req.user.id) {
    return next(new AppError("Item not found", 404));
  }
  next();
});

exports.getAllItems = factory.getAll(Item);
exports.getItem = factory.getOne(Item);
exports.createItem = factory.createOne(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
