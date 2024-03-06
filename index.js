const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserRouter = require("./Routes/UserRoutes");
const BlogRouter = require("./Routes/BlogRoutes");
// demo
const Demo = require("./Models/Demo.Schema");

const app = express();
app.use(express.json());
require("dotenv").config();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, token",
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("mongo connected"))
  .catch((error) => console.log("Error: ", error));

app.use("/User", UserRouter);
app.use("/Blog", BlogRouter);
app.use("/Demo", (req, res) => {
  const { Body } = req.body;

  Demo.create({ Body })
    .then((data) => {
      res
        .status(200)
        .send({ Success: true, Message: "Demo passed", Demo: data._doc });
    })
    .catch((error) => {
      res.status(400).send({ Success: false, Message: "Demo failed" });
    });
});

app.listen(3001, () => console.log("listening at port 3001"));
