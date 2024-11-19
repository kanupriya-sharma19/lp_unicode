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

test('Post Blog', async () => {
    const res = await request(app)
        .post('/blog/post_blog')
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


test('View All Blog',async()=>{
    await request(app)
    .get('/blog/view_blog')  
    .expect(200);
})

test('View Blog by Tags',async()=>{
    await request(app)
    .get('/blog/blog_by_tags/Promises')  
    .expect(200);
})

test('Update Blog', async () => {
    const res = await request(app)
        .patch('/blog/update_blog/672a4a7c597058b26b35f43b') 
        .send({  
            Title: "Understanding Uploading Images in Cloudinary with Node.js" 
        });
  
    expect(res.statusCode).toBe(200);


});

test('Delete Blog', async () => {
    await request(app)
           .delete('/blog/delete_blog/672a4a7c597058b26b35f43b')
           .expect(200); 
   });
