const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("config");
const _ = require("lodash");
const Joi = require("joi");
const { User, validates, validateUser } = require("../models/user");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const { valid } = require("joi");
const router = express.Router();
const {GenRSAKeypair, RsaEncrypt} = require('../common/rsaKeyFunc')
const  { SHA256 }  = require("crypto-js");

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");


  // gen server keyPair
  const server_keyPair = GenRSAKeypair();


  user = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: SHA256(req.body.password).toString(),
    publicKeyUser: req.body.publicKeyUser,
    publicKeyServer: server_keyPair.publicKey,
    privateKeyServer: server_keyPair.privateKey
    
  });
  try {
    await user.save();
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.jwtPrivateKey
    );
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email", "publicKeyServer"]));
  } catch (err) {
    console.log("error: ", err);
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.send("this user does'nt exists in the database!");
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.send("this user does'nt exists in the database!");
  res.send(user);
});

router.post("/login", async (req, res) => {
  const { error } = validates(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user) return res.send("User already logged in!");
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const hash_pw = SHA256(req.body.password).toString()

  const validpassword = hash_pw === user.password;
  if (!validpassword) return res.status(400).send("invalid email or password");

  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.jwtPrivateKey
  );
  res.header("x-auth-token").send(token);
});

router.post("/logout", async (req, res) => {});
module.exports = router;
