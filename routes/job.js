import express from 'express';
import { displayjob, postjob, updatejob, deletejob} from '../controllers/job.js';
const job = express.Router();
import { verifyRec } from '../middlewares/authentication.js';
job.get('/view_jobs',verifyRec,displayjob );
job.post('/post_jobs', verifyRec,postjob);
job.patch('/update_jobs/:id',verifyRec,updatejob);
job.delete('/delete_jobs/:id',verifyRec,deletejob);
export {job};