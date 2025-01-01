import request from "supertest";
import { app } from "../index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectToDB } from "../utils/connection.js";  // Ensure your DB connection function is imported correctly

dotenv.config(); // Load environment variables

beforeAll(async () => {
    await connectToDB(); // Ensure DB connection is established before running tests
});

afterAll(async () => {
  await mongoose.connection.close(); // Close DB connection
  
});
const user_id = "677506bd8559f8385aa601e6"; // Generate a fake user ID
const job_id = new mongoose.Types.ObjectId();  // Generate a fake job ID

const validToken = jwt.sign({ person: user_id }, process.env.SECRETKEY, {
  expiresIn: "1h",
});

let applicationId;
test("Post application", async () => {
    const res = await request(app)
      .post("/application/post_application")
      .set("authorization", `${validToken}`) 
      .send({
       
        job_id: job_id,  
        status: "pending",
      });
  
    console.log(res.body); // Log the response body for debugging
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id"); // Check for the presence of the _id field, which confirms the application was created
    expect(res.body).toHaveProperty("status", "pending"); 
  applicationId = res.body._id;// Optionally check for other properties like status
  });
  

test("View All applications", async () => {
  const res = await request(app)
    .get("/application/view_all_application")
  expect(res.statusCode).toBe(200);
});

test("View my application", async () => {
    const res = await request(app)
      .get("/application/view_application")  // Your endpoint for viewing the user's application
      .set("authorization", `${validToken}`);  // Attach the valid token for authentication
  
  
    expect(res.body[0]).toHaveProperty("user_id");  // Ensure that the returned application is for the correct user
  });
  

// Test for deleting an application
test("Delete application", async () => {
  const res = await request(app)
    .delete(`/application/delete_application/${applicationId}`)
     // Attach valid token for auth

  expect(res.statusCode).toBe(200);
});
