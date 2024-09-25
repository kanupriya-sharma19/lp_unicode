import express from "express";
import dotenv from "dotenv";
import {router} from "./routes/routes.js";
import { connectToDB } from './utils/connection.js';
dotenv.config();
const app = express();
const port = process.env.PORT;

connectToDB();
app.listen(port, (req, res) => {
  console.log("APP IS AT", port);
});


app.use(express.json());
app.use("/users", router);


