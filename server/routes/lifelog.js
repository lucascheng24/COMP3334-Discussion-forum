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


module.exports = router;
