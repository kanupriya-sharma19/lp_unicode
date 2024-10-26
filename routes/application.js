import express from 'express';
import { verifyToken } from "../middlewares/authentication.js";
import { displayapplication, postapplication, updateapplication, deleteapplication} from '../controllers/application.js';
const application = express.Router();

application.get('/view_application',verifyToken,displayapplication );
application.post('/post_application',verifyToken, postapplication);
application.patch('/update_application/:id',verifyToken,updateapplication);
application.delete('/delete_application/:id',verifyToken,deleteapplication);
export {application};