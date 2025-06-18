const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionrequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender  about ";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      touserID: loggedInUser._id,
      status: "interested",
    }).populate("fromuserID", USER_SAFE_DATA);
    // .populate("fromuserID", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { touserID: loggedInUser._id, status: "accepted" },
        { fromuserID: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromuserID", USER_SAFE_DATA)
      .populate("touserID", USER_SAFE_DATA);

    

    const data = connectionRequests.map((row) => {
      if (row.fromuserID._id.toString() === loggedInUser._id.toString()) {
        return row.touserID;
      }
      return row.fromuserID;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{fromuserID: loggedInUser._id }, { touserID: loggedInUser._id }],
    }).select("fromuserID  touserID");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromuserID.toString());
      hideUsersFromFeed.add(req.touserID.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;