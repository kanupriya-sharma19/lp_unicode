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
let  blogId;
const Author_id = new mongoose.Types.ObjectId(); 
test('Post Blog', async () => {
    const res = await request(app)
        .post('/blog/post_blog')
        .send({
            Author_id: Author_id,
            AuthorType: 'person',
            Title: "Understanding Cloudinary",
            Content: "Easy to upload images with our app",
            Tags: ["Cloudinary", " Node js"]
        });
    
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Blog created successfully'); 
    expect(res.body.blog).toHaveProperty('_id');
    blogId = res.body.blog._id;
});


test('View All Blog',async()=>{
    await request(app)
    .get('/blog/view_blog')  
    .expect(200);
})

test('View Blog by Tags',async()=>{
    await request(app)
    .get('/blog/blog_by_tags/JavaScript,Promises')  
    .expect(200);
})

test('Update Blog', async () => {
    const res = await request(app)
        .patch(`/blog/update_blog/${blogId}`) 
        .send({  
            Title: "Understanding Uploading Images in Cloudinary with Node.js" 
        });
  
    expect(res.statusCode).toBe(200);


});

test('Delete Blog', async () => {
    const res = await request(app)
        .delete(`/blog/delete_blog/${blogId}`)
        .expect(200);
        expect(res.body).toHaveProperty('message', 'Blog deleted successfully');
});