import express from 'express';

import { displayComp, postComp, updateComp, deleteComp,addRecruiter,removeRecruiter,viewRecruiters} from '../controllers/company.js';
const comp = express.Router();

comp.get('/view_companies',displayComp );
comp.post('/post_company', postComp);
comp.patch('/update_company/:id',updateComp);
comp.delete('/delete_company/:id',deleteComp);
comp.get("/viewRecruiters/:id", viewRecruiters);
comp.delete("/removeRecruiter", removeRecruiter);
comp.patch("/addRecruiter", addRecruiter);

export {comp};

