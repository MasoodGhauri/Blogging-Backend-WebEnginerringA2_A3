const User = require("../Models/User.Schema");
const Blog = require("../Models/Blog.Schema");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    let foundUser = await User.findOne({ Email });
    if (foundUser) {
      if (foundUser._doc.Password === Password) {
        if (foundUser._doc.Status === "active") {
          let I = foundUser._doc._id;
          let U = foundUser._doc.Username;
          let E = foundUser._doc.Email;
          let R = foundUser._doc.UserRole;

          let token = await jwt.sign({ I, U, E, R }, process.env.SECRET_KEY, {
            expiresIn: "10m",
          });

          let { Password, ...rest } = foundUser._doc;
          res.json({
            Success: true,
            Message: "Login Successfull",
            User: rest,
            token,
          });
        } else {
          res.status(200).send({
            Success: true,
            Message: "Account blocked. Cannot login right now",
          });
        }
      } else {
        res.json({ Success: false, Message: "Invalid Credentials" });
      }
    } else {
      res.status(404).json({ Success: false, Message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ Success: false, Message: "Internal Server Error" });
  }
};

const verifyAuth = async (req, res, next) => {
  let token = req.headers.token;
  try {
    let DecodedData = await jwt.verify(token, process.env.SECRET_KEY);

    if (DecodedData) {
      let u = {
        id: DecodedData.I,
        email: DecodedData.E,
        name: DecodedData.U,
        role: DecodedData.R,
      };
      res.locals.usr = u;
      //   res.status(200).json({ Message: "Authenticated" });
      next();
    } else {
      res
        .status(404)
        .json({ Success: false, Message: "Your Are Not Authenticated" });
    }
  } catch (err) {
    res
      .status(404)
      .json({ Success: false, Message: "Your Are Not Authenticated", err });
  }
};

const verifyAuthorAuth = (req, res, next) => {
  const { id } = req.body;
  const userId = res.locals.usr.id;

  Blog.findById(id)
    .then((blog) => {
      if (blog._doc.Author.id === userId) {
        next();
      } else {
        res
          .status(400)
          .send({ Success: false, Message: "User not the author of blog." });
      }
    })
    .catch((error) => {
      res.status(400).send({ Success: false, Message: "Blog not found" });
    });
};

const verifyAdminAuth = (req, res, next) => {
  const { role } = res.locals.usr;

  if (role === "admin") {
    next();
  } else {
    res.status(400).send({
      Success: false,
      Message: "Not an ADMIN!!!. Cannot do this funtion",
    });
  }
};

module.exports = {
  login,
  verifyAuth,
  verifyAuthorAuth,
  verifyAdminAuth,
};
