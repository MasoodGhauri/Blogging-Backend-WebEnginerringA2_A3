const Blog = require("../Models/Blog.Schema");
const User = require("../Models/User.Schema.js");

const postBlog = (req, res) => {
  const { Title, Body } = req.body;
  const Author = res.locals.usr.id;

  let toCreate = { Author, Title, Body };

  if ("Keywords" in req.body) {
    const { Keywords } = req.body;
    toCreate.Keywords = Keywords;
  }
  if ("Catagories" in req.body) {
    const { Catagories } = req.body;
    toCreate.Catagories = Catagories;
  }

  Blog.create(toCreate)
    .then((data) => {
      res.status(200).send({
        Success: true,
        Message: "New Blog Posted Successfully",
        Blog: data._doc,
      });
    })
    .catch((error) => {
      res.status(400).send({ Success: false, Message: "Blog Posting failed" });
    });
};

const updateBlog = async (req, res) => {
  let { id, ...rest } = req.body;
  await Blog.findByIdAndUpdate(id, rest, { new: true })
    .then((data) => {
      res
        .status(200)
        .send({ Success: true, Message: "Blog Updated", Blog: data._doc });
    })
    .catch((error) => {
      res.status(404).send({ Success: false, Message: "Blog not found" });
    });
};

const deleteBlog = async (req, res) => {
  let toFind = req.params.id;
  try {
    let deletedBlog = await Blog.findByIdAndDelete(toFind);
    res.status(200).send({
      Success: true,
      Message: "Blog deleted successfully",
      DeletedBlog: deletedBlog._doc,
    });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "Blog not found" });
  }
};

const getBlog = async (req, res) => {
  let toFind = req.params.id;
  try {
    let foundBlog = await Blog.findOne({ _id: toFind });
    res
      .status(200)
      .send({ Success: true, Message: "Blog found", Blog: foundBlog._doc });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "Blog not found" });
  }
};

const hideBlog = async (req, res) => {
  let { id } = req.body;
  await Blog.findByIdAndUpdate(id, { Status: "disabled" }, { new: true })
    .then((blog) => {
      res
        .status(200)
        .send({ Success: true, Message: "Blog disabled", Blog: blog._doc });
    })
    .catch((error) => {
      res.status(404).send({ Success: false, Message: "Blog not found" });
    });
};
const unHideBlog = async (req, res) => {
  let { id } = req.body;
  await Blog.findByIdAndUpdate(id, { Status: "active" }, { new: true })
    .then((blog) => {
      res
        .status(200)
        .send({ Success: true, Message: "Blog activated", Blog: blog._doc });
    })
    .catch((error) => {
      res.status(404).send({ Success: false, Message: "Blog not found" });
    });
};

const addComment = async (req, res) => {
  let { blogId, comment } = req.body;
  let id = res.locals.usr.id;
  try {
    const foundBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { Comments: { userID: id, body: comment } } },
      { new: true }
    );

    const addedComment = foundBlog.Comments[foundBlog.Comments.length - 1];
    res.status(200).send({
      Success: true,
      Message: "Comment added to blog",
      Comment: addedComment,
    });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "Error adding comment" });
  }
};

const addRating = async (req, res) => {
  let { blogId, stars } = req.body;
  let id = res.locals.usr.id;

  try {
    const foundBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { RatingStars: { userID: id, stars } } },
      { new: true }
    );

    const addedRating = foundBlog.RatingStars[foundBlog.RatingStars.length - 1];
    res.status(200).send({
      Success: true,
      Message: "Rating added to blog",
      Rating: addedRating,
    });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "Error adding Rating" });
  }
};

const getBlogsByPagination = (req, res) => {
  const page = req.query.p || 0;
  const blogsPerPage = 3;

  Blog.find()
    .limit(blogsPerPage)
    .sort({ createdAt: -1 })
    .skip(page * blogsPerPage)
    .then((blogs) => {
      res.status(200).send({ Success: true, Blogs: blogs });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ Success: false, Message: "Error fetching blogs", Error: err });
    });
};

const getBlogsSortedByCreationTime = (req, res) => {
  const seq = req.query.seq || -1;
  const p = req.query.p || 0;
  const blogsPerPage = 3;

  Blog.find()
    .sort({ createdAt: seq })
    .limit(blogsPerPage)
    .skip(p * blogsPerPage)
    .then((blogs) => {
      res.status(200).send({ Success: true, Blogs: blogs });
    })
    .catch((err) => {
      res.status(500).send({
        Success: false,
        Message: "Error fetching sorted blogs",
        Error: err,
      });
    });
};

const getSearchedBlogs = (req, res) => {
  let Sort = req.body.Sort || -1;
  let searchParams = {};
  if ("Author" in req.body) searchParams.Author = req.body.Author;
  if ("Title" in req.body) searchParams.Title = req.body.Title;
  if ("Keywords" in req.body)
    searchParams.Keywords = { $in: req.body.Keywords };
  if ("Catagories" in req.body)
    searchParams.Catagories = { $in: req.body.Catagories };

  Blog.find(searchParams)
    .sort({ createdAt: Sort })
    .then((blogs) => {
      res.status(200).send({ Success: false, Blogs: blogs });
    })
    .catch((err) => {
      res.status(500).send({ Success: false, Message: "Error fetching blogs" });
    });
};

const getFollowedBlogs = async(req, res) => {
  const {id}= res.locals.usr
  const page = req.query.p || 0;
  const blogsPerPage = 3;

  let f;
  User.findById(id)
  .then(user=>{
    f = user._doc.Following;
  })
  .catch((err) => {
    res
      .status(500)
      .send({ Success: false, Message: "Error fetching followed blogs", Error: err });
  });

  Blog.find({ Author: { $in: f } })
    .limit(blogsPerPage)
    .sort({ createdAt: -1 })
    .skip(page * blogsPerPage)
    .then((blogs) => {
      res.status(200).send({ Success: true, Blogs: blogs });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ Success: false, Message: "Error fetching blogs", Error: err });
    });
};

module.exports = {
  postBlog,
  updateBlog,
  getBlog,
  hideBlog,
  unHideBlog,
  addComment,
  getBlogsByPagination,
  getBlogsSortedByCreationTime,
  getSearchedBlogs,
  addRating,
  deleteBlog,
  getFollowedBlogs
};
