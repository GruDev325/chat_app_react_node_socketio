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

// Post global message
router.post("/global", (req, res) => {
  let message = new GlobalMessage({
    from: jwtUser.id,
    body: req.body.body,
  });

  if (String(req.body.body).length == 0) return;

  req.io.sockets.emit("messages", req.body.body);

  message.save((err) => {
    if (err) {
      console.log(err);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Failure" }));
      res.sendStatus(500);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Success" }));
    }
  });
});


// Get conversations list
router.get('/conversations', (req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.id);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.password': 0,
            'recipientObj.__v': 0,
            'recipientObj.date': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(conversations);
            }
        });
});