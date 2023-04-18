const mongoose = require("mongoose");
const Joi = require("joi");
// const { tagSchema } = require("./tag");

const lifelogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 80,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 180,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  upvotes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const Lifelog = mongoose.model("Lifelog", lifelogSchema);

function validateLifelog(lifelog) {
  const schema = Joi.object({
    title: Joi.string().required().min(10).max(80),
    description: Joi.string().required().min(3).max(1024),
    author: Joi.string().required()
  });
  return schema.validate(lifelog);
}

exports.Lifelog = Lifelog;
exports.validateLifelog = validateLifelog;