const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const {connectToDB } = require('./models/models');
connectToDB();
const pinoHttp = require('pino-http');
const pino = require('pino');
const logger = pino(
  {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true, 
        translateTime: 'SYS:standard', 
        ignore: 'pid,hostname' 
      }
    }
  },

);

app.use(pinoHttp({ logger }));
app.listen(port, (req, res) => {
  console.log("APP IS AT", port);
});

const router = require("./routes/routes");
app.use(express.json());
app.use("/users", router);


