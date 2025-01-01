import request from "supertest";
import { app } from "../index.js";
import jwt from "jsonwebtoken"; 
import mongoose from "mongoose";
import { connectToDB } from "../utils/connection.js";

beforeAll(async () => {
    await connectToDB();
    
});

afterAll(async () => {
    await mongoose.connection.close();
    
});

let jobId;

const validToken = jwt.sign(
    { Rec: "67040706a757e080fdb4e110", Comp: "66f969820b02cc09e18f44e3" },
    process.env.SECRETKEY,
    { expiresIn: "1h" }
  );
  
  test('Post Job', async () => {
    const res = await request(app)
      .post('/job/post_jobs')
      .set("authorization", `${validToken}`)
      .send({
        Title: "demo",
        Description: "demo",
        Requirements: ["demo"],
        Salary_range: "demo",
        Location: "demo",
        Job_type: "part-time"
      });
  
    console.log(res.body); 
    jobId=res.body.job._id;
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Job created successfully');
   
  });
  

test('View All Jobs',async()=>{
    await request(app)
    .get('/job/view_jobs')  
    .expect(200);
})


     test("Update Job", async () => {
        const res = await request(app)
          .patch(`/job/update_jobs/${jobId}`)
         .set("authorization", `${validToken}`).send({
        Title:"demo"
         });
         console.group(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Job updated successfully'); 
      });

      test("Delete Job", async () => {
        const res = await request(app)
          .delete(`/job/delete_jobs/${jobId}`)
         .set("authorization", `${validToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Job deleted successfully'); 
      });

      test("Shortlisted users", async () => {
        const res = await request(app)
          .post(`/job/shortlist/671fba3791aecb2a9ec1adf9`)
         .set("authorization", `${validToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Applicant successfully shortlisted'); 
      });

