const User = require("../Models/User.Schema.js");

const register = (req, res) => {
  const { Username, Email, Password } = req.body;
  let toCreate = { Username, Email, Password };

  if ("UserRole" in req.body) {
    toCreate.UserRole = req.body.UserRole;
  }

  User.create(toCreate)
    .then((data) => {
      const { Password, ...rest } = data._doc;
      res
        .status(200)
        .send({ Success: true, Message: "New User registered", User: rest });
    })
    .catch((error) => {
      res
        .status(400)
        .send({ Success: false, Message: "User registration failed" });
    });
};

const getUser = async (req, res) => {
  let toFind = req.params.id;
  try {
    let foundUser = await User.findOne({ _id: toFind });
    let { Password, ...rest } = foundUser._doc;
    res.status(200).send({ Success: true, Message: "User found", User: rest });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "User not found" });
  }
};

const updateUser = async (req, res) => {
  let { id, ...rest } = req.body;
  await User.findByIdAndUpdate(id, rest, { new: true })
    .then((user) => {
      const { Password, ...rest } = user._doc;
      res
        .status(200)
        .send({ Success: true, Message: "User Updated", User: rest });
    })
    .catch((error) => {
      res.status(404).send({ Success: false, Message: "User not found" });
    });
};

const deleteUser = async (req, res) => {
  let toFind = req.params.id;
  try {
    let deletedUser = await User.findByIdAndDelete(toFind);
    let { Password, ...rest } = deletedUser._doc;
    res.status(200).send({
      Success: true,
      Message: "User deleted successfully",
      DeletedUser: rest,
    });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "User not found" });
  }
};

const blockUser = async (req, res) => {
  let { id } = req.body;
  await User.findByIdAndUpdate(id, { Status: "blocked" }, { new: true })
    .then((user) => {
      res
        .status(200)
        .send({ Success: true, Message: "User Blocked", User: user._doc });
    })
    .catch((error) => {
      res.status(404).send({ Success: false, Message: "User not found" });
    });
};

const unBlockUser = async (req, res) => {
  let { id } = req.body;
  await User.findByIdAndUpdate(id, { Status: "active" }, { new: true })
    .then((user) => {
      res
        .status(200)
        .send({ Success: true, Message: "User unBlocked", User: user._doc });
    })
    .catch((error) => {
      res.status(404).send({ Success: false, Message: "User not found" });
    });
};

const followUser = async (req, res) => {
  let { toFollowId } = req.body;
  let { id } = res.locals.usr;

  try {
    const user = await User.findById(id);

    if (!user._doc.Following.includes(toFollowId)) {
      const foundUserToFollow = await User.findByIdAndUpdate(
        toFollowId,
        { $push: { FollowedBy: id } },
        { new: true }
      );
      const foundUserToFollowedBy = await User.findByIdAndUpdate(
        id,
        { $push: { Following: toFollowId } },
        { new: true }
      );

      let followedUser = {
        Name: foundUserToFollow._doc.Username,
        id: foundUserToFollow._doc._id,
      };

      let followedByUser = {
        Name: foundUserToFollowedBy._doc.Username,
        id: foundUserToFollowedBy._doc._id,
      };

      res.status(200).send({
        Success: true,
        Message: "Started Following",
        Now_Following: followedUser,
        Followed_By: followedByUser,
      });
    } else {
      res
        .status(400)
        .send({ Success: false, Message: "Already following user" });
    }
  } catch (error) {
    res.status(400).send({ Success: false, Message: "Error following user" });
  }
};

const unFollowUser = async (req, res) => {
  let { toUnFollowId } = req.body;
  let { id } = res.locals.usr;

  try {
    const user = await User.findById(id);

    if (user._doc.Following.includes(toUnFollowId)) {
      const foundUserToUnFollow = await User.findByIdAndUpdate(
        toUnFollowId,
        { $pull: { FollowedBy: id } },
        { new: true }
      );
      const foundUserToUnFollowedBy = await User.findByIdAndUpdate(
        id,
        { $pull: { Following: toUnFollowId } },
        { new: true }
      );

      let unFollowedUser = {
        Name: foundUserToUnFollow._doc.Username,
        id: foundUserToUnFollow._doc._id,
      };

      let unFollowedByUser = {
        Name: foundUserToUnFollowedBy._doc.Username,
        id: foundUserToUnFollowedBy._doc._id,
      };

      res.status(200).send({
        Success: true,
        Message: "Unfollowed successfully",
        UnFollowed: unFollowedUser,
        UnFollowed_By: unFollowedByUser,
      });
    } else {
      res
        .status(400)
        .send({ Success: false, Message: "Not a follower of this user yet" });
    }
  } catch (error) {
    res.status(400).send({ Message: "Error unfollowing user" });
  }
};

module.exports = {
  register,
  getUser,
  updateUser,
  blockUser,
  unBlockUser,
  deleteUser,
  followUser,
  unFollowUser,
};
