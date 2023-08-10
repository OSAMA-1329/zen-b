const studentRouter = require("express").Router();
const Student = require("../Model/studentModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { EMAIL_ADDRESS, EMAIL_PASSWORD, FEURL } = require("../utils/config");

/*****************sign up new student*********************/

studentRouter.post("/student/signup", async (req, res) => {
  //preparing object to store in collection

  try {
    const { email, name, experience, qualification, password } = new Student(
      req.body
    );
    //incase of any data missing throw error
    if (!name || !email || !password) {
      res.status(400).json({ Err: "all fields are mandotary" });
      return;
    }

    const matchedStudent = await Student.findOne({ email });
    if (matchedStudent) {
      res.status(400).json({ Err: "Student already exists" });
      return;
    }

    //generating random string

    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const link = `${FEURL}/confirm/${randomString}`;

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating new student
    const student = await Student.create({
      email,
      name,
      experience,
      qualification,
      password: hashedPassword,
      resetToken: randomString,
    });

    //sending email for Confirm account

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    const sendMail = async () => {
      const info = await transporter.sendMail({
        from: `"Udhayasooriyan" <${EMAIL_ADDRESS}>`,
        to: student.email,
        subject: "Confirm account",
        text: link,
      });
    };

    sendMail();

    res
      .status(201)
      .json({ message: `account created successfully ${student.name}` });
    //
  } catch (error) {
    return res.status(400).json({ Err: "Error on sign up please try again" });
  }
});

/**********confirming/authenticate student account*************/

studentRouter.patch("/student/confirm/:id", async (req, res) => {
  try {
    const resetToken = req.params.id;
    const matchedStudent = await Student.findOne({ resetToken });

    //if student not found throw error
    if (matchedStudent === null || matchedStudent.resetToken === "") {
      return res
        .status(400)
        .json({ err: "student not exists or link expired" });
    }

    //confirming and updating account
    matchedStudent.verified = true;

    matchedStudent.resetToken = "";

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    res.status(201).json({
      message: `${matchedStudent.name} account has been verified successfully`,
    });
    //
  } catch (error) {
    return res.status(400).json({ Err: "student not exists or link expired" });
  }
});

/***************Creating link for reseting password*************/

studentRouter.put("/student/forgot", async (req, res) => {
  try {
    const { email } = req.body;

    const matchedStudent = await Student.findOne({ email });

    // if student not exist throw error
    if (!matchedStudent) {
      res.status(400).json({
        Err: "please enter valid email / Entered mail not registered",
      });
      return;
    }

    //generating randow string
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const link = `${FEURL}/reset/${randomString}`;

    // adding reset token to student db
    matchedStudent.resetToken = randomString;

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    //sending email for resetting

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    const sendMail = async () => {
      const info = await transporter.sendMail({
        from: `"Udhayasooriyan" <${EMAIL_ADDRESS}>`,
        to: matchedStudent.email,
        subject: "Reset Password",
        text: link,
      });
    };

    sendMail()
      .then(() => {
        return res
          .status(201)
          .json({ message: `Mail has been send to ${matchedStudent.email}` });
      })
      .catch((err) => res.status(500).json(err));

    //
  } catch (error) {
    return res.status(500).json(error);
  }
});

/*******************reseting password**************************/

studentRouter.patch("/student/reset/:id", async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.params.id;

    // finding matched student
    const matchedStudent = await Student.findOne({ resetToken });

    //if student not found throw error
    if (matchedStudent === "null" || matchedStudent.resetToken === "") {
      return res
        .status(400)
        .json({ Err: "student not exists or reset link expired" });
    }

    // hasing the new password and update
    const hashedPassword = await bcrypt.hash(password, 10);

    matchedStudent.password = hashedPassword;
    matchedStudent.resetToken = "";

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    //sending response

    res.status(201).json({
      message: `${matchedStudent.name} password has been updated successfully`,
    });

    //
  } catch (error) {
    return res
      .status(400)
      .json({ Err: "student not exists or reset link expired" });
  }
});

module.exports = studentRouter;
