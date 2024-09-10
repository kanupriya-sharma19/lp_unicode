const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const {connectToDB } = require('./utils/connection');
connectToDB();
app.listen(port, (req, res) => {
  console.log("APP IS AT", port);
});

const router = require("./routes/routes");
app.use(express.json());
app.use("/users", router);


