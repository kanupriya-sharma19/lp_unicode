import request from "supertest";
import { app } from "../index.js";
import jwt from "jsonwebtoken"; 
import mongoose from "mongoose";
import { connectToDB } from "../utils/connection.js";
import dotenv from "dotenv";

dotenv.config();
beforeAll(async () => {
    await connectToDB();    
});

afterAll(async () => {
    await mongoose.connection.close();   
});
const userId = "67113ed2d3bf12d7a451c93f";
       
let validToken = jwt.sign({ person: userId}, process.env.SECRETKEY, {
    expiresIn: "1h",
  });
test('View All', async () => {
    const res = await request(app)
        .get('/connect/view_all')
      
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Successfully read all');  
});

test('Company Follower Count', async () => {
    const res = await request(app)
        .get('/connect/count')
      
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Success');  
});

test('Followers', async () => {
    const res = await request(app)
        .get(`/connect/view_followers/${userId}`)
      
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Success');  
});

test('Following', async () => {
    const res = await request(app)
        .get(`/connect/view_followings`)
        .set("authorization", `${validToken}`);
      
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Success');  
});

test('Follow', async () => {
    const res = await request(app)
        .post(`/connect/follow`).send({
            FollowerType:"person",
            Following_id:"671e2bb23fd8f1de61558bfc",
        })
        .set("authorization", `${validToken}`);
      
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'follow created successfully');  
});

test('UnFollow', async () => {
    const res = await request(app)
        .delete(`/connect/unfollow/671e2bb23fd8f1de61558bfc`)
        .set("authorization", `${validToken}`);
      
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Successfully unfollowed');  
});