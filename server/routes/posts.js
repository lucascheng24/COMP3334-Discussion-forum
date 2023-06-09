const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Post, validatePost } = require("../models/post");
const { Reply, validateReply } = require("../models/replies");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const { Tag } = require("../models/tag");
const jwt = require("jsonwebtoken");
const {GenRSAKeypair, RsaEncrypt, RsaDecrypt} = require('../common/rsaKeyFunc')

router.get("/", async (req, res) => {

  const token = req.headers['x-auth-token']

  const decrypted_jwt = jwt.decode(token)

  if (decrypted_jwt && decrypted_jwt._id) {
    let user = await User.findById(decrypted_jwt._id);

    if (user && user.publicKeyUser) {
      const publicKeyUser = user.publicKeyUser
      let all_posts = await Post.find().populate("author", "name -_id");


      decrypt_posts = []
      if (Array.isArray(all_posts)) {
        all_posts.forEach(element => {

          if (element.title.length > 15) {
            element.title = element.title.toString().slice(0, 14) + `...`
          }
          if (element.description.length > 15) {
            element.description = element.description.toString().slice(0, 14) + `...`
          }
          if (element.author.length > 15) {
            element.author = element.author.toString().slice(0, 14) + `...`
          }
          if (element.upvotes.length > 0) {
            element.upvotes = []
          }

          decrypt_posts.push(RsaEncrypt(JSON.stringify(element), publicKeyUser))
        });
        res.send({decrypt_posts: decrypt_posts});
      } else {
        res.status(400).send("b/e error");
      }
    }
  } else {
    res.status(400).send("missing jwt");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id }).populate(
      "author",
      "name username"
    );
    const views = post[0].views;
    post[0].views = views + 1;
    const result = await post[0].save();
    res.send(post[0]);
  } catch (ex) {
    return res.send(ex.message);
  }
});

router.post("/create", auth, async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const tags = req.body.tags;
  const tags_array = [];
  for (let i = 0; i < tags.length; i++) {
    const tag_in_db = await Tag.findById(tags[i]);
    if (!tag_in_db) return res.status(400).send("Invalid Tag");
    tags_array.push(tag_in_db);
  }
  const post = new Post({
    title: req.body.title,
    tags: tags_array,
    description: req.body.description,
    author: req.user._id,
    views: 1,
  });
  try {
    await post.save();
    console.log(post);
    res.send("Post succesfully created.");
  } catch (err) {
    console.log("dsaf");
    console.log("error: ", err);
  }
});

router.put("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(400).send("Post doesn't exists");
  if (post.author == req.user._id)
    return res.status(400).send("You can't upvote your own post");
  const upvoteArray = post.upvotes;
  const index = upvoteArray.indexOf(req.user._id);
  if (index === -1) {
    upvoteArray.push(req.user._id);
  } else {
    upvoteArray.splice(index, 1);
  }
  post.upvotes = upvoteArray;
  const result = await post.save();
  const post_new = await Post.find({ _id: post._id }).populate(
    "author",
    "name username"
  );
  res.send(post_new);
});

module.exports = router;
