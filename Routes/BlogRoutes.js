const {
  verifyAuth,
  verifyAuthorAuth,
} = require("../Controllers/AuthController");
const {
  postBlog,
  getBlog,
  updateBlog,
  hideBlog,
  addComment,
  addRating,
  deleteBlog,
  unHideBlog,
  getBlogsByPagination,
  getBlogsSortedByCreationTime,
  getSearchedBlogs,
  getFollowedBlogs,
  getDemoBlogs,
  getBlogWithUserAuthor,
  getViewBlogs,
} = require("../Controllers/BlogController");
const express = require("express");

const router = express.Router();

router.post("/new", verifyAuth, postBlog);
router.patch("/", verifyAuth, verifyAuthorAuth, updateBlog);
router.get("/followedblogs", verifyAuth, getFollowedBlogs);
router.get("/myblogs", verifyAuth, getBlogWithUserAuthor);
router.get("/viewBlogs/:id", getViewBlogs);
router.get("/getAllBlogDemo", getDemoBlogs);
router.get("/", getBlogsByPagination);
router.get("/sorted", getBlogsSortedByCreationTime);
router.get("/search", getSearchedBlogs);
router.patch("/hide", verifyAuth, verifyAuthorAuth, hideBlog);
router.patch("/activate", verifyAuth, verifyAuthorAuth, unHideBlog);
router.patch("/comment", verifyAuth, addComment);
router.patch("/rate", verifyAuth, addRating);
router.get("/:id", getBlog);
router.delete("/delete", verifyAuth, verifyAuthorAuth, deleteBlog);

module.exports = router;
