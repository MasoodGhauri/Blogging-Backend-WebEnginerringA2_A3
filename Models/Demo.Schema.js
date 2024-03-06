const mongoose = require("mongoose");

const Demo = mongoose.Schema(
  {
    Body: String,
  },
  { timestamps: true }
);

const model = mongoose.model("Demo", Demo);

module.exports = model;
