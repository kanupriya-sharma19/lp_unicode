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

test('Post company', async () => {
    const res = await request(app)
        .post('/company/post_company')
        .send({
            Name:'Apple',
            Website:'Apple.com',
            Industry:'Tech',
            Recruiters:'6720755f4f193fe28f0ea1d3',
            Description:'Tech++',
        });
    
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Company created successfully'); 
});


test('View All companies',async()=>{
    await request(app)
    .get('/company/view_companies')  
    .expect(200);
})


test('Update company', async () => {
    const res = await request(app)
        .patch('/company/update_company/672a51f6ce549d81f57df2b3') 
        .send({  
             Description:'Tech+'
        });
  
    expect(res.statusCode).toBe(200);


});

test('Delete company', async () => {
    await request(app)
           .delete('/company/delete_company/672a51f6ce549d81f57df2b3')
           .expect(200); 
   });
