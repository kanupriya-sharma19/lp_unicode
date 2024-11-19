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


test('Signup', async () => {
    const res = await request(app)
        .post('/user/signup')
        .send({
            Author_id: '67113ed2d3bf12d7a451c93f',
            AuthorType: 'person',
            Title: "Understanding Cloudinary with Node js",
            Content: "Easy to upload images with our app",
            Tags: ["Cloudinary", " Node js"],
            Created_at: '2023-10-01'
        });
    
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Blog created successfully'); 
});


test('Protected Route',async()=>{
    await request(app)
    .get('/user/protected')  
    .expect(200);
})

