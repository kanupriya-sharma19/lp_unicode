import express from "express";
import { image } from "../middlewares/multer.js";
import { verifyToken } from "../middlewares/authentication.js";
import {
  postperson,
  loginperson,
  update_user,
  delete_user,
} from "../controllers/user.js";
const router = express.Router();
router.post("/signup", image, postperson);
router.post("/login", loginperson);
router.delete("/delete_user",verifyToken, delete_user);

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", person: req.person });
});


router.put("/update_user", image,verifyToken, update_user);
export { router };
