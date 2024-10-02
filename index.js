import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/user.js";
import { comp } from "./routes/company.js";
import { rec } from "./routes/recruiter.js"; 
import { connectToDB } from './utils/connection.js';
import morgan from "morgan";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(morgan("tiny"));  
app.use(express.json()); 

connectToDB();


app.use("/", router);  
app.use("/", comp);  
app.use("/", rec);
app.listen(port, () => {
  console.log(`APP IS RUNNING AT PORT ${port}`);
});



