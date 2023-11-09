const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A blog must have a title"],
    unique: true,
    trim: true,
    maxlength: [40, "A blog title must have less or equal than 40 characters"],
    minlength: [10, "A blog title must have more or equal than 10 characters"],
  },
  body: {
    type: String,
    required: [true, "A blog must have a body"],
    trim: true,
    maxlength: [
      1000,
      "A blog body must have less or equal than 1000 characters",
    ],
    minlength: [10, "A blog body must have more or equal than 10 characters"],
  },
  tag: {
    type: String,
    enum: {
      values: [
        "finance",
        "energy",
        "foreign exchange",
        "tech",
        "science",
        "health",
        "politics",
        "sports",
        "entertainment",
        "business",
        "travel",
        "lifestyle",
        "other",
      ],
      message:
        "Tag is either: tech, science, health, politics, sports, entertainment, business, travel, lifestyle, finance, energy, foreign exchange or other",
    },
  },
  author: {
    type: String,
    required: [true, "A blog must have an author"],
    trim: true,
    maxlength: [
      40,
      "An author name must have less or equal than 40 characters",
    ],
    minlength: [
      10,
      "An author name must have more or equal than 10 characters",
    ],
  },
  authorImage: {
    type: String,
    required: [true, "A blog must have an author image"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "A blog must have an image"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// Create a model based on the schema
const Blog = mongoose.model("Blog", blogSchema);

// Export the model
module.exports = Blog;
