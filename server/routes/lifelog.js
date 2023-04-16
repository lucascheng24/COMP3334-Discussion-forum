const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const _ = require("lodash");
const Joi = require("joi");
const { User, validates, validateUser } = require("../models/user");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const { valid } = require("joi");
const router = express.Router();
const { Lifelog, validateLifelog } = require("../models/lifelog");

// get all user
router.get("/all", async (req, res) => {

  try {

    console.log('enter /all api')
    const users = await User.find({}).select('name username');
    console.log('>>>> /AllUsers: ')
    console.log(users)
    res.send(users);


  } catch (error) {
    console.log('error:', error)
    res.status(500).json({ error: "Server error" });
  }  
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.send("this user does'nt exists in the database!");
  res.send(user);
});

router.post("/create", auth, async (req, res) => {
  console.log('/create')
  const { error } = validateLifelog(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // const tags = req.body.tags;
  // const tags_array = [];
  // for (let i = 0; i < tags.length; i++) {
  //   const tag_in_db = await Tag.findById(tags[i]);
  //   if (!tag_in_db) return res.status(400).send("Invalid Tag");
  //   tags_array.push(tag_in_db);
  // }
  const lifelog = new Lifelog({
    title: req.body.title,
    description: req.body.description,
    author: req.user._id,
  });
  try {
    await lifelog.save();
    console.log(lifelog);
    res.send("lifelog succesfully created.");
  } catch (err) {
    console.log("save lifelog error");
    console.log("error: ", err);
  }
});


router.get("/get/:id", async (req, res) => {
  try {
    console.log('/get/:username')
    console.log('req.params')
    console.log(req.params)
    console.log(req.params.id)
    const user = await User.findOne({ username: req.params.id })

    if (user) {
      console.log(user._id)
      console.log(user.name)
      console.log(user.email)

      if (user._id) {
        const all_logs = await Lifelog.find({ author: user._id })

        if (all_logs) {
          console.log(all_logs)
  
          res.send(all_logs)
          return
        }
      }
    }
    res.send([]);
  } catch (ex) {
    return res.send(ex.message);
  }
});


module.exports = router;
