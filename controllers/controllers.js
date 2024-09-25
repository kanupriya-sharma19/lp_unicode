import { person } from "../models/models.js";
import dotenv from 'dotenv';
dotenv.config(); 
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import {cloudinary} from "../utils/cloudinary.js";
import path from 'path';

async function postperson(req, res) {
  try {
    const { email, password } = req.body;
    if(!req.body.emailId.includes('@gmail.com')){
      return res.status(500).send('Invalid gmail !!')
  }
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
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
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
        pass: process.env.APPKEY,
      },
    });
    let mailOptions = {
      from: process.env.USER, 
      to: email,
      subject: 'Logged in successfully!!',
      html: '<p>Welcome to our app &hearts;!</p>',
    };
    try {
      await transporter.sendMail(mailOptions); 
      console.log(`Message Sent to ${email}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
      return res.status(500).json({ message: "Error sending email", error: error.message });
    }
    const token = jwt.sign({ person: foundperson._id }, secretKey, { expiresIn: '30d' });
    return res.status(200).json({ message: "Login successful", token });
    
  } catch (error) {
    return res.status(500).json({ message: "Error in logging in", error: error.message });
  }
}

async function upload(req, res) {
  const { email,password } = req.body;
  const foundperson = await person.findOne({ email });
  const isMatch = await bcrypt.compare(password, foundperson.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  if (!foundperson) {
    return res.status(400).json({ message: "Invalid email" });
  }

  try {
    const fileName = path.parse(req.file.originalname).name; 

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilepics",
      public_id: fileName, 
    });

    foundperson.profileImage = result.secure_url; 
    await foundperson.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded!",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error in uploading image", error: err.message});
  }
}
async function updateImage(req, res) {
  try {
    const { publicId, email, password } = req.body;
    if (!email || !password || !publicId) {
      return res.status(400).json({ message: "Email, password, and public ID are required" });
    }
    const foundperson = await person.findOne({ email });
    if (!foundperson) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, foundperson.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilepics",
      public_id: publicId, 
      overwrite: true, 
    });
    foundperson.profileImage = result.secure_url;
    await foundperson.save();
    res.status(200).json({
      success: true,
      message: "Image updated!",
      data: result,
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating image", error: err.message });
  }
}

export { postperson, loginperson, upload, updateImage };

