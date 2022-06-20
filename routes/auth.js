const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt= require("jsonwebtoken")

//---------REGISTER
router.post('/register', async (req, res) => {
  const newUser = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECURITY
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//---------LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    !user && res.status(401).json('Invalid Credentials');
    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECURITY
    );
    const originalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
    originalPassword !== req.body.password && res.status(401).json('Wrong Password');
    const accessToken= jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin,
    }, process.env.JWT_SEC,
    {expiresIn:"3d"}
    );
    const {password, ...others}=user._doc
    res.status(200).json({...others, accessToken})
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
