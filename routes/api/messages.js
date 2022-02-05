const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();

const keys = require("../../config/keys");
const verify = require("../../utilities/verify-token");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const GlobalMessage = require("../../models/GlobalMessage");

let jwtUser = null;

// Token verfication middleware
router.use(function (req, res, next) {
  try {
    jwtUser = jwt.verify(verify(req), keys.secretOrKey);
    next();
  } catch (err) {
    console.log(err);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Unauthorized" }));
    res.sendStatus(401);
  }
});

// Get global messages
router.get("/global", (req, res) => {
  GlobalMessage.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "fromObj",
      },
    },
  ])
    .project({
      "fromObj.password": 0,
      "fromObj.__v": 0,
      "fromObj.date": 0,
    })
    .exec((err, messages) => {
      if (err) {
        console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Failure" }));
        res.sendStatus(500);
      } else {
        res.send(messages);
      }
    });
});
