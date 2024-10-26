import express from 'express';
import { verifyRec } from '../middlewares/authentication.js';
import {  displayRec, postRec, updateRec, deleteRec,loginRec} from '../controllers/recruiter.js';
const rec = express.Router();

rec.get('/view_recruiter',displayRec );
rec.post('/post_recruiter', postRec);
rec.post('/login_recruiter', loginRec);
rec.get('/protected', verifyRec, (req, res) => {
    res.json({ message: "This is a protected route", person: req.person });
  });
rec.patch('/update_recruiter',verifyRec,updateRec);
rec.delete('/delete_recruiter',verifyRec,deleteRec);
export {rec};

