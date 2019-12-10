const User = require("../models/userModel");
const Child = require("../models/childAccountModel");
const multer = require("multer");
const sharp = require("sharp");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

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

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

const filterBody = (obj, ...authorizedInput) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (authorizedInput.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  // sets user Id as url param
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route does not exist. Please use /signup"
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1.) make sure there are no password updates
  if (req.body.password || req.body.password2) {
    return next(new AppError("This route is not for updating passwords", 400));
  }
  // 2.) sanitize body
  const filteredBody = filterBody(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  // 3. update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1.) get account
  const user = await User.findById(req.user.id);
  // 2.) delete all children
  await Child.deleteMany({ parent: req.user.id });
  // 3.) delete account
  await User.findByIdAndDelete(req.user.id);
  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
