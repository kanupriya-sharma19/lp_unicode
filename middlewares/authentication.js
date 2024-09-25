import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config(); 
const secretKey = process.env.SECRETKEY;
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const token =bearerHeader;
      req.token = token;
      jwt.verify(token, secretKey, (err, data) => {
        if (err) {
          res.status(403).send({ message: "Invalid token" ,err});
        } else {
          req.person = data;
          next();
        }
      });
    } else {
      res.status(403).send({ message: "Token missing or invalid" });
    }
  }
  export {verifyToken}