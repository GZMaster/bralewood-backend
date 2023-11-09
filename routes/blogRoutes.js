const express = require("express");
const blogController = require("../controllers/blogController");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(
    userController.protect,
    userController.restrictTo("admin"),
    blogController.uploadBlogImage,
    blogController.createBlog
  );

router.route("/length").get(blogController.getLength);

router.route("/tags").get(blogController.getTags);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(
    userController.protect,
    userController.restrictTo("admin"),
    blogController.uploadBlogImage,
    blogController.updateBlog
  )
  .delete(
    userController.protect,
    userController.restrictTo("admin"),
    blogController.deleteBlog
  );

module.exports = router;
