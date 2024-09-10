const express = require('express');
const { postperson, loginperson, verifyToken,upload,image, updateImage } = require('../controllers/controllers');
const router = express.Router();
router.post('/signup', postperson);
router.post('/login', loginperson);
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", person: req.person });
});
router.post('/upload', image.single('file'),upload);
router.post('/update_image', image.single('file'),updateImage);
module.exports = router;
