const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    Username: String,
    Email: String,
    Password: String,
    UserRole: {
      type: String,
      default: "regular",
    },
    Status: {
      type: String,
      default: "active",
    },
    FollowedBy: [{ type: String, default: "" }],
    Following: [{ type: String, default: "" }],
  },
  { timestamps: true }
);

const model = mongoose.model("User", User);

module.exports = model;
