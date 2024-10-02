import { person } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { cloudinary } from "../utils/cloudinary.js";
import path from "path";
let secretKey = process.env.SECRETKEY;
async function postperson(req, res) {
  try {
    const { Name, Email, Password, Tech_Stack, Bio } = req.body;
    if (!Email.includes("@gmail.com")) {
      return res.status(400).send("Invalid Gmail address!");
    }
    if (
      !req.files ||
      !req.files.Profile_Image ||
      req.files.Profile_Image.length === 0 ||
      !req.files.Resume ||
      req.files.Resume.length === 0
    ) {
      return res.status(400).send("Profile image and Resume are required!");
    }

    const profileImageFile = req.files.Profile_Image[0];
    const profileImageName = path.parse(profileImageFile.originalname).name;

    let Profile_Image;
    try {
      const profileImageResult = await cloudinary.uploader.upload(
        profileImageFile.path,
        {
          folder: "Profile_pics",
          public_id: profileImageName,
        }
      );
      Profile_Image = profileImageResult.secure_url;
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Error uploading profile image", error: err.message });
    }

    const resumeFile = req.files.Resume[0];
    const resumeFileName = path.parse(resumeFile.originalname).name;

    let Resume;
    try {
      const resumeResult = await cloudinary.uploader.upload(resumeFile.path, {
        folder: "Resume",
        public_id: resumeFileName,
      });
      Resume = resumeResult.secure_url;
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Error uploading resume", error: err.message });
    }
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newperson = new person({
      Name,
      Email,
      Password: hashedPassword,
      Profile_Image,
      Resume,
      Tech_Stack,
      Bio,
    });

    await newperson.save();
    res.status(201).json({ message: "Person created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ message: "Error in creating person", error: error.message });
  }
}

async function loginperson(req, res) {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const foundperson = await person.findOne({ Email });
    if (!foundperson) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(Password, foundperson.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.APPKEY,
      },
    });
    let mailOptions = {
      from: process.env.USER,
      to: Email,
      subject: "Logged in successfully!!",
      html: "<p>Welcome to JOB APP &hearts;!</p>",
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Message Sent to ${Email}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
      return res
        .status(500)
        .json({ message: "Error sending email", error: error.message });
    }
    const token = jwt.sign({ person: foundperson._id }, secretKey, {
      expiresIn: "30d",
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in logging in", error: error.message });
  }
}

async function update_user(req, res) {
  try {
    const UserId = req.params.id;
    let Profile_Image;
    let Resume;
    if (req.file) {
      const publicId = `profilepics/${UserId}`;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profilepics",
        public_id: publicId,
        overwrite: true,
      });
      Profile_Image = result.secure_url;
    }

    if (req.files && req.files.resume) {
      const resumePublicId = `resumes/${UserId}`;
      const resumeResult = await cloudinary.uploader.upload(
        req.files.resume[0].path,
        {
          folder: "resumes",
          public_id: resumePublicId,
          resource_type: "raw",
          overwrite: true,
        }
      );
      Resume = resumeResult.secure_url;
    }

    const updateData = {
      Tech_Stack: req.body.Tech_Stack,
      Email: req.body.Email,
      Password: req.body.Password,
    };

    if (Profile_Image) updateData.Profile_Image = Profile_Image;
    if (Resume) updateData.Resume = Resume;

    const updatedUser = await person.findOneAndUpdate(
      { _id: UserId },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).send({ message: "Error updating User", error });
  }
}

async function delete_user(req, res) {
  try {
    const UserId = req.params.id;

    const user = await person.findById(UserId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const profilePublicId = user.Profile_Image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`Profile_pics/${profilePublicId}`);

    if (user.Resume) {
      const resumePublicId = user.Resume.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`Resume/${resumePublicId}`, {
        resource_type: "raw",
      });
    }

    await person.findByIdAndDelete(UserId);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting User", error });
  }
}

// async function upload(req, res) {
//   const { Email,Password } = req.body;
//   const foundperson = await person.findOne({ Email });
//   const isMatch = await bcrypt.compare(Password, foundperson.Password);
//   if (!isMatch) {
//     return res.status(401).json({ message: "Invalid password" });
//   }

//   if (!foundperson) {
//     return res.status(400).json({ message: "Invalid email" });
//   }

//   try {
//     const fileName = path.parse(req.file.originalname).name;

//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "profilepics",
//       public_id: fileName,
//     });

//     foundperson.Profile_Image = result.secure_url;
//     await foundperson.save();

//     return res.status(200).json({
//       success: true,
//       message: "Image uploaded!",
//       data: result,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Error in uploading image", error: err.message});
//   }
// // }
// async function updateImage(req, res) {
//   try {
//     const { publicId, Email, Password } = req.body;
//     if (!Email || !Password || !publicId) {
//       return res.status(400).json({ message: "Email, password, and public ID are required" });
//     }
//     const foundperson = await person.findOne({ Email });
//     if (!foundperson) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }
//     const isMatch = await bcrypt.compare(Password, foundperson.Password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "profilepics",
//       public_id: publicId,
//       overwrite: true,
//     });
//     foundperson.Profile_Image = result.secure_url;
//     await foundperson.save();
//     res.status(200).json({
//       success: true,
//       message: "Image updated!",
//       data: result,
//     });

//   } catch (err) {
//     res.status(500).json({ message: "Error updating image", error: err.message });
//   }
// }

export { postperson, loginperson, update_user, delete_user };
