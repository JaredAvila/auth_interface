const factory = require("./handlerFactory");
const Child = require("../models/childAccountModel");
const AppError = require("../utils/AppError");

exports.setParent = (req, res, next) => {
  if (!req.body.parent) req.body.parent = req.user.id;
  next();
};

exports.verifyParent = async (req, res, next) => {
  const child = req.user.children.find(el => {
    return el._id.toString() === req.params.id;
  });
  if (!child) {
    return next(new AppError("Child does not belong to you", 403));
  }
  next();
};

exports.createChild = factory.createOne(Child);
exports.getChild = factory.getOne(Child);
exports.updatedChild = factory.updateOne(Child);
exports.deleteChild = factory.deleteOne(Child);
