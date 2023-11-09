const express = require("express");
const mongoose = require("mongoose");
const UserRouter = require("./Routes/UserRoutes");
const BlogRouter = require("./Routes/BlogRoutes");

const app = express();
app.use(express.json());
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("mongo connected"))
  .catch((error) => console.log("Error: ", error));

app.use("/User", UserRouter);
app.use("/Blog", BlogRouter);

app.listen(3000, () => console.log("listening at port 3000"));
