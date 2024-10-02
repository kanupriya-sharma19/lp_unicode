import express from 'express';

import {  displayRec, postRec, updateRec, deleteRec} from '../controllers/recruiter.js';
const rec = express.Router();

rec.get('/view_recruiter',displayRec );
rec.post('/post_recruiter', postRec);
rec.patch('/update_recruiter/:id',updateRec);
rec.delete('/delete_recruiter/:id',deleteRec);
export {rec};

