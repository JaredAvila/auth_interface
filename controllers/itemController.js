const Item = require("../models/itemModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFitler = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an image. Please upload an image file only.", 400),
      false
    );
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFitler
});

exports.uploadPhoto = upload.single("photo");

exports.resizePhoto = (req, res, next) => {
  if (!req.file) return next();
  if (req.file.size > 1100000)
    return next(
      new AppError("Filesize too large. Please uplad images under 1.0mb")
    );

  req.file.filename = `item-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(300, 200)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/items/${req.file.filename}`);
  next();
};

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

exports.createItem = catchAsync(async (req, res, next) => {
  if (req.file) req.body.photo = req.file.filename;
  const newItem = await Item.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: newItem
    }
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  if (req.file) req.body.photo = req.file.filename;
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedItem) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: updatedItem
    }
  });
});

exports.getAllItems = factory.getAll(Item);
exports.getItem = factory.getOne(Item);
exports.deleteItem = factory.deleteOne(Item);
