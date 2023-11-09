const multer = require("multer");
const path = require("path");
const Blog = require("../models/blogModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/images`);
  },
  filename: function (req, file, cb) {
    // cb(null, `${uuidv4()}-${file.originalname}`);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    return cb(null, true);
  }
  return cb(
    new AppError("Not an image! Please upload only images.", 400),
    false
  );
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

exports.uploadBlogImage = upload.single("image");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const blogs = await features.query;

  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.getLength = catchAsync(async (req, res, next) => {
  const noOfBlogs = await Blog.countDocuments();

  if (!noOfBlogs) {
    return next(new AppError("No blogs found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      noOfBlogs,
    },
  });
});

exports.createBlog = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path.replace("C:\\fakepath\\", "");
    req.body.authorImage = req.file.path.replace("C:\\fakepath\\", "");
  }

  const newBlog = await Blog.create(req.body);

  if (!newBlog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      blog: newBlog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path.replace("C:\\fakepath\\", "");
    req.body.authorImage = req.file.path.replace("C:\\fakepath\\", "");
  }

  const updateBlog = await Blog.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateBlog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog: updateBlog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOneAndDelete({ _id: req.params.id });

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getBlogTag = catchAsync(async (req, res, next) => {
  const tags = await Blog.find().distinct("tag");

  res.status(200).json({
    status: "success",
    data: {
      tags,
    },
  });
});
