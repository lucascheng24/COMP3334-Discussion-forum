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
const {GenRSAKeypair, RsaEncrypt, RsaDecrypt, caesarCipherEncrypt, caesarCipherDecrypt} = require('../common/rsaKeyFunc')


function getRandomIntInRange(min, max) {
  // The Math.floor() function rounds a number down to the nearest integer
  // The Math.random() function generates a random number between 0 and 1 (exclusive)
  // To generate a random number in the range [min, max], we multiply the random number by (max - min + 1)
  // and add min to the result to shift the range to [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


router.post("/login1", async (req, res) => {

  try {
    if (!req.body) {
      return res.status(400).send("missing email and pwEncPuk");
    }
  
    const schema = Joi.object({
      email: Joi.string().min(5).required().email(),
      pwEncPuk: Joi.string().min(5).required(),
    });
  
    const { errorB } = schema.validate(req.body);
    if (errorB) return res.status(400).send(errorB.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
  
    if (!user || !user.email) {
      return res.status(400).send("wrong email");
    }
  
    const hash_pw = user.password;
  
    const given_Puk = caesarCipherDecrypt(req.body.pwEncPuk, hash_pw)
  
    if (given_Puk !== user.publicKeyUser) {
      return res.status(400).send("not match public key");
    }
  
    // public key is match
    const challenge_R = getRandomIntInRange(0, 2048).toString()
  
    const puk_enc_R = RsaEncrypt(challenge_R, user.publicKeyUser)
  
    const pw_enc_puk_enc_R = caesarCipherEncrypt(puk_enc_R, user.password)
  
  
    user.temp_challengeR = challenge_R
  
    const result = await user.save();
  
    res.send({pw_enc_puk_enc_R: pw_enc_puk_enc_R});

  } catch (error) {
    console.log(error)
  }
});

router.post("/login2", async (req, res) => {

  try {
    if (!req.body) {
      return res.status(400).send("missing email and pwEncPuk");
    }

    const schema = Joi.object({
      challenge_R: Joi.string().required(),
    });
  
    const { errorB } = schema.validate(req.body);
    if (errorB) return res.status(400).send(errorB.details[0].message);

    let user = await User.findOne({ email: req.body.email });
  
    if (!user || !user.email) {
      return res.status(400).send("wrong email");
    }

    const user_challenge_R = req.body.challenge_R

    if (user_challenge_R === user.temp_challengeR) {
      // success auth
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.jwtPrivateKey
      );
      res.setHeader("x-auth-token", token).send({token});
    } else {
      return res.status(400).send("wrong challenge_R");
    }
  } catch (error) {
    console.log(error)
  }
});



module.exports = router;
