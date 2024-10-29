import { Recruiters } from "../models/recruiter.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
let secretKey = process.env.SECRETKEY;

async function displayRec(req, res) {
  try {
    const allRec = await Recruiters.find({}).populate({
      path: "CompanyId",
      model: "Company",
    });

    res.status(200).json(allRec);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get recruiters", details: error.message });
  }
}

async function postRec(req, res) {
  try {
    const {
      Name,
      Password,
      Email,
      CompanyId,
      Qualification,
      Current_position,
      Salary,
    } = req.body;
    if (!Email) {
      return res.status(400).send("Email is required!");
    }

    if (!Email.includes("@gmail.com")) {
      return res.status(400).send("Invalid Gmail address!");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newrec = new Recruiters({
      Name,
      Email,
      Password: hashedPassword,
      CompanyId,
      Qualification,
      Current_position,
      Salary,
    });

    await newrec.save();

    res.status(200).send({ message: "Recruiter created successfully", newrec });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in creating recruiter", details: error.message });
  }
}

async function loginRec(req, res) {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const foundperson = await Recruiters.findOne({ Email });
    if (!foundperson) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(Password, foundperson.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { person: foundperson._id, companyId: foundperson.CompanyId },
      secretKey,
      {
        expiresIn: "30d",
      }
    );
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in logging in", error: error.message });
  }
}

async function updateRec(req, res) {
  try {
    const recId = req.person.person;
    const updates = req.body;

    const updatedRec = await Recruiters.findOneAndUpdate(
      { _id: recId },
      updates,
      { new: true },
      { runValidators: true }
    );

    if (!updatedRec) {
      return res.status(404).send({ message: "Recruiterss not found" });
    }

    res
      .status(200)
      .send({ message: "Recruiterss updated successfully", updatedRec });
  } catch (error) {
    res.status(500).send({ message: "Error updating Recruiterss", error });
  }
}

async function deleteRec(req, res) {
  try {
    const recId = req.person.person;
    const rec = await Recruiters.findOneAndDelete({ _id: recId });

    if (rec) {
      res.status(200).json({
        message: "Recruiters deleted successfully",
        rec,
      });
    } else {
      res.status(404).json({ error: "Recruiterss not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting Recruiterss", err });
  }
}

export { displayRec, postRec, updateRec, deleteRec, loginRec };
