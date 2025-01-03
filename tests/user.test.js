import request from "supertest";
import { app } from "../index.js";
import jwt from "jsonwebtoken"; 
import mongoose from "mongoose";
import httpMocks from 'node-mocks-http';
import { connectToDB } from "../utils/connection.js";
import jest from "jest-mock";
import { verifyToken } from "../middlewares/authentication.js";


beforeAll(async () => {
    await connectToDB(); 
});

afterAll(async () => {
    await mongoose.connection.close();
    
});
let validToken ;


test('Post User', async () => {
    const res = await request(app)
        .post('/user/signup')
        .send({
            Name:"demo",
            Email:"divky@gmail.com",
            Password:"dwd"
            
        });
       
       
 validToken = jwt.sign({ person: res.body.person._id}, process.env.SECRETKEY, {
    expiresIn: "1h",
  });
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty('message', 'Person created successfully'); 
    expect(res.body.person).toHaveProperty('_id');
    
});

test('should call next if token is valid', async () => {
  const mockPerson = { _id: 'mockPersonId' }; 
  const res = httpMocks.createResponse();
  res.body = { person: mockPerson }; 
  const validToken = jwt.sign(
    { person: res.body.person._id }, 
    process.env.SECRETKEY,
    { expiresIn: '1h' }
  );
  const req = httpMocks.createRequest({
    headers: {
      authorization: validToken, 
    },
  });
  const next = jest.fn();
  await verifyToken(req, res, next);
  expect(next).toHaveBeenCalled();
  expect(req.person).toHaveProperty('person', 'mockPersonId');
});




test("Protected Route", async () => {
    const res = await request(app)
      .get("/user/protected")
     .set("authorization", `${validToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'This is a protected route'); 
  });


test("Log In", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
    Email:"divky@gmail.com",
            Password:"dwd"
      });
  
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful'); 
    
  });


  test("Update User", async () => {
    const res = await request(app)
      .put("/user/update_user")
     .set("authorization", `${validToken}`).send({
        Email:"d$%^$&@gmail.com",
     });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User updated successfully'); 
  });

 

  test("Delete User", async () => {
    const res = await request(app)
      .delete("/user/delete_user")
      .set("authorization", `${validToken}`);
  
  
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });
  