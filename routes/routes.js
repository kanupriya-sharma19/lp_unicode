const express = require('express');
const { postperson, loginperson, verifyToken } = require('../controllers/controllers');
const router = express.Router();
router.post('/signup', postperson);
router.post('/login', loginperson);
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", person: req.person });
});
module.exports = router;
