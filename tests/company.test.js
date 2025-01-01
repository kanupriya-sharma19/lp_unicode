import request from "supertest";
import {app} from "../index.js"; 
import { connectToDB } from '../utils/connection.js';
import mongoose from 'mongoose';

beforeAll(async () => {
     connectToDB();
}, 10000);

afterAll(async () => {
    await mongoose.connection.close();
});
let companyId;
const recruiterId = "6720755f4f193fe28f0ea1d3"; 
test('Post company', async () => {
    const res = await request(app)
        .post('/company/post_company')
        .send({
            Name:'Apple',
            Website:'Apple.com',
            Industry:'Technology',
            Description:'Tech++',
        });
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Company created successfully'); 
    companyId = res.body.company._id;
    
});


test('View All companies',async()=>{
    await request(app)
    .get('/company/view_companies')  
    .expect(200);
})


test('Update company', async () => {
    const res = await request(app)
        .patch(`/company/update_company/${companyId}`) 
        .send({  
             Description:'Tech+'
        });
  
    expect(res.statusCode).toBe(200);


});

test('View Recruiters of the company', async () => {
    const res = await request(app)
           .get(`/company/viewRecruiters/${companyId}`);
           console.log(res.body); 


    expect(res.statusCode).toBe(200);
    
});

test('Add Recruiters of the company', async () => {
    const res = await request(app)
           .patch(`/company/addRecruiter`)
           .send({
               CompanyId: companyId,
               recruiterId: recruiterId
           });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully added the recruiter');
});

test('Remove Recruiters of the company', async () => {
    const res = await request(app)
           .delete(`/company/removeRecruiter`)
           .send({
               CompanyId: companyId,
               recruiterId: recruiterId
           });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully removed the recruiter');
});


   
test('Delete company', async () => {
    await request(app)
           .delete(`/company/delete_company/${companyId}`)
           .expect(200); 
   });

   
