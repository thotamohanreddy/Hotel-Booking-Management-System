const express = require("express");
const router = express.Router();

const User = require("../models/user");

const generateUserNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

router.post("/register", async (req, res) => {
  try {
    const {name, email, password, isAdmin} = new User(req.body);
    const usernumber = generateUserNumber();

    const newUser = new User({
      usernumber,
      name,
      email,
      password,
      isAdmin
    })
    const user = await newUser.save();

    res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      const temp = {
        usernumber: user.usernumber,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };
      res.send(temp);
    } else {
      return res.status(400).json({ message: "Login Failed" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
