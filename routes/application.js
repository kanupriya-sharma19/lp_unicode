import express from 'express';
import { verifyToken } from "../middlewares/authentication.js";
import { displayapplication, postapplication, deleteapplication,displayAllApplication} from '../controllers/application.js';
const application = express.Router();
application.get('/view_application',verifyToken,displayapplication );
application.get('/view_all_application',displayAllApplication );
application.post('/post_application',verifyToken, postapplication);
application.delete('/delete_application/:id',deleteapplication);
export {application};