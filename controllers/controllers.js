const { person } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const secretKey = process.env.SECRETKEY; 

async function postperson(req, res) {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newperson = new person({
      email,
      password: hashedPassword,
    });
    await newperson.save();
    res.status(200).json({ message: "person created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error in creating person", error: error.message });
  }
}

async function loginperson(req, res) {
  try {
    const { email, password } = req.body;
    const foundperson = await person.findOne({ email });
    if (!foundperson) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, foundperson.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sharmakanpuriya@gmail.com',
        pass: process.env.APPKEY
      }
    });

    let mailOptions = {
      user: 'sharmakanpuriya@gmail.com',
      to: email,
      subject: 'Logged in successfully!!',
      html: '<p>Welcome to our app &hearts;!</p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(`Error: ${error}`);
      }
      console.log(`Message Sent: ${info.response}`);
    });
  const token = jwt.sign({ person: foundperson._id }, secretKey, { expiresIn: '30d' });
  return res.status(200).json({ message: "Login successful", token });
    
  } catch (error) {
    return res.status(500).send({ message: "Error in logging in", error });
  }
}


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const token =bearerHeader;
    req.token = token;
    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        res.status(403).send({ message: "Invalid token" ,err});
      } else {
        req.person = data;
        next();
      }
    });
  } else {
    res.status(403).send({ message: "Token missing or invalid" });
  }
}

module.exports = { postperson, loginperson, verifyToken };
