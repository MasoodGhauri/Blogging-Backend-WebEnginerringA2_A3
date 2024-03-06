const mongoose = require("mongoose");

const Blog = mongoose.Schema(
  {
    Author: {
      name: String,
      id: String,
    },
    Body: String,
    Title: String,
    Keywords: [{ type: String, default: "" }],
    Catagories: [{ type: String, default: "" }],
    RatingStars: [
      {
        userID: String,
        stars: Number,
      },
    ],
    Comments: [{ userID: String, userName: String, body: String }],
    Status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Blog", Blog);

module.exports = model;
