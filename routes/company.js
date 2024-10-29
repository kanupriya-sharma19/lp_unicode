import express from 'express';

import { displayComp, postComp, updateComp, deleteComp} from '../controllers/company.js';
const comp = express.Router();

comp.get('/view_companies',displayComp );
comp.post('/post_company', postComp);
comp.patch('/update_company/:id',updateComp);
comp.delete('/delete_company/:id',deleteComp);
export {comp};

