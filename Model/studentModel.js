const mongoose = require("mongoose");

// defining a schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add the user name"],
  },
  batch: {
    type: String,
    default: "B47-WD2 Tamil",
  },
  email: {
    type: String,
    required: [true, "please add the email address"],
    unique: [true, "email already taken"],
  },
  password: {
    type: String,
    required: [true, "please add password"],
  },
  resetToken: {
    type: String,
  },
  qualification: {
    type: String,
  },
  experience: {
    type: String,
  },
  codeKata: {
    type: String,
  },
  webKata: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  mockInterview: {
    type: String,
  },
  leave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
  ],
  portfolio: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
    },
  ],
  capstone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Capstone",
    },
  ],
  webcode: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webcode",
    },
  ],
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

// create a model
module.exports = mongoose.model("Student", studentSchema, "students");
