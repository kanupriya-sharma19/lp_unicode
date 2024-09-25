import express from 'express';
import { image } from "../middlewares/multer.js";
import { verifyToken } from '../middlewares/authentication.js';
import { postperson, loginperson, upload, updateImage } from '../controllers/controllers.js';
const router = express.Router();
router.post('/signup', postperson);
router.post('/login', loginperson);
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", person: req.person });
});
router.post('/upload', image.single('file'),upload);
router.patch('/update_image', image.single('file'),updateImage);
export {router};

