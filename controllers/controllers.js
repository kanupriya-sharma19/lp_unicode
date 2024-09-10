const { person } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const secretKey = process.env.SECRETKEY; 
const cloudinary = require("../utils/cloudinary");
const multer = require('multer');

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
        user: process.env.USER,
        pass: process.env.APPKEY
      }
    });

    let mailOptions = {
      user: process.env.USER,
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

const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

const image = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

async function upload(req,res){
  const { email } = req.body;
    const foundperson = await person.findOne({ email });
    if (!foundperson) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  try{   const output=await cloudinary.uploader.upload(req.file.path, function (err, result){
        if(err) {
        console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error"
          })
        } else{ return res.status(200).json({
          success: true,
          message:"Uploaded!",
          data: result
        })}
      });
  
  } catch(err){
    return res.status(500).send({ message: "Error in logging in", err });
  }
}

async function updateImage(req, res) {
  try { 
    const { publicId,email } = req.body; 
    const foundperson = await person.findOne({ email });
    if (!foundperson) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!publicId) {
      return res.status(400).json({ message: "No public ID provided" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: publicId, 
      overwrite: true 
    });
    res.status(200).json({
      success: true,
      message: "Image updated!",
      data: result
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating image", error: err });
  }
}
module.exports = { postperson, loginperson, verifyToken,image,upload,updateImage };
