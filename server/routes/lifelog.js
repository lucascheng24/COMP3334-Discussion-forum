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
const {GenRSAKeypair, RsaEncrypt, RsaDecrypt} = require('../common/rsaKeyFunc')

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

  // console.log(req)
  // }
  try {
    const user = await User.findOne({ username: req.body.author })

    if (user && user.username) {
      const lifelog = new Lifelog({
        title: req.body.title,
        description: req.body.description,
        author: user._id,
      });

      await lifelog.save();
      console.log(lifelog);
      res.send("lifelog succesfully created.");
      return
    }
  } catch (err) {
    console.log("save lifelog error");
    console.log("error: ", err);
  }
});


router.get("/get/:id", async (req, res) => {
  try {
    const token = req.headers['x-auth-token']
    const decrypted_jwt = jwt.decode(token)


    if (decrypted_jwt && decrypted_jwt._id) {
      let current_user = await User.findById(decrypted_jwt._id);
  
      if (current_user && current_user.publicKeyUser) {
        const publicKeyUser = current_user.publicKeyUser

        const lifelogOwner = await User.findOne({ username: req.params.id })

        if (lifelogOwner) {
          console.log(lifelogOwner._id)
          console.log(lifelogOwner.name)
          console.log(lifelogOwner.email)
    
          if (lifelogOwner._id) {
            const all_logs = await Lifelog.find({ author: lifelogOwner._id })
    
            if (all_logs && Array.isArray(all_logs)) {

              const encrypt_posts = []
              all_logs.forEach(element => {
                encrypt_posts.push(RsaEncrypt(JSON.stringify(element), publicKeyUser))
              });
              res.send({encrypt_posts: encrypt_posts});
      
              // res.send(all_logs)
              return
            } else {
              res.status(400).send("b/e error");
            }
          }
        }        
      }
    } else {
      res.status(400).send("missing jwt");
    }

    // console.log('/get/:username')
    // console.log('req.params')
    // console.log(req.params)
    // console.log(req.params.id)
    // const user = await User.findOne({ username: req.params.id })

    // if (user) {
    //   console.log(user._id)
    //   console.log(user.name)
    //   console.log(user.email)

    //   if (user._id) {
    //     const all_logs = await Lifelog.find({ author: user._id })

    //     if (all_logs) {
    //       // console.log(all_logs)
  
    //       res.send(all_logs)
    //       return
    //     }
    //   }
    // }
    // res.send([]);



  } catch (ex) {
    return res.send(ex.message);
  }
});


module.exports = router;
