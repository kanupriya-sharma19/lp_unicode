import request from "supertest";
import { app } from "../index.js";
import jwt from "jsonwebtoken"; 
import mongoose from "mongoose";
import { connectToDB } from "../utils/connection.js";
import dotenv from "dotenv";
import { verifyRec } from "../middlewares/authentication.js";
import httpMocks from 'node-mocks-http';
import jest from "jest-mock";
dotenv.config();
beforeAll(async () => {
    await connectToDB();
    
});

afterAll(async () => {
    await mongoose.connection.close();
    
});
let validToken ;

test('Post Recruiter', async () => {
    const res = await request(app)
      .post('/recruiter/post_recruiter')
      .send({
        Name: "demo",
        Password: "demo",
        Email: "demo665@gmail.com",  
        Qualification: "demo",
        Current_position: "demo",
        Salary: "demo",
      });  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Recruiter created successfully');  
 validToken = jwt.sign({ person:res.body.newrec._id}, process.env.SECRETKEY, {
    expiresIn: "1h",
  });
  });
  
  
test('should call next if token is valid', async () => {
  const mockPerson = { _id: 'mockPersonId' }; 
  const res = httpMocks.createResponse();
  res.body = { person: mockPerson }; 
  const validToken = jwt.sign(
    { person:res.body.person._id}, 
    process.env.SECRETKEY,
    { expiresIn: '1h' }
  );
  const req = httpMocks.createRequest({
    headers: {
      authorization: validToken, 
    },
  });
  const next = jest.fn();
  await verifyRec(req, res, next);
  expect(next).toHaveBeenCalled();
  expect(req.person).toHaveProperty('person', 'mockPersonId');
});


test('Get Recruiter', async () => {
    const res = await request(app)
        .get('/recruiter/view_recruiter')
      
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Successfully retreived the recs'); 
  
    
});

test("Protected Route", async () => {
    const res = await request(app)
      .get("/recruiter/protected")
     .set("authorization", `${validToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'This is a protected route'); 
  });


test("Log In", async () => {
    const res = await request(app)
      .post("/recruiter/login_recruiter")
      .send({
    Email:"demo65@gmail.com",
            Password:"demo"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful'); 
    
  });


  test("Update User", async () => {
    const res = await request(app)
      .patch("/recruiter/update_recruiter")
     .set("authorization", `${validToken}`).send({
        Email:"dyufv@gmail.com",
     });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Recruiterss updated successfully'); 
  });

  test("Delete User", async () => {
    const res = await request(app)
      .delete("/recruiter/delete_recruiter")
      .set("authorization", `${validToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Recruiters deleted successfully');
  });
  