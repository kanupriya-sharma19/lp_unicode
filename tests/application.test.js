import request from "supertest";
import {app} from "../index.js"; 
import { connectToDB } from '../utils/connection.js';
import mongoose from 'mongoose';

beforeAll(async () => {
    await connectToDB();
}, 10000);

afterAll(async () => {
    await mongoose.connection.close();
});

test('Post application', async () => {
    const res = await request(app)
        .post('/application/post_application')
        .send({
           user_id:'',
           job_id:'672076f64f193fe28f0ea1d9',
           status:'pending',
           applied_date:'2023-09-01'
        
        });
    
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'application created successfully'); 
});


test('View All application',async()=>{
    await request(app)
    .get('/application/view_all_application')  
    .expect(200);
})

test('View my application',async()=>{
    await request(app)
    .get('/application/view_application')  
    .expect(200);
})



test('Delete application', async () => {
    await request(app)
           .delete('/application/delete_application/672a4a7c597058b26b35f43b')
           .expect(200); 
   });
