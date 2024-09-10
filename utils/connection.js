const mongoose=require('mongoose');
connectToDB=()=>{
    mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.error("DB connection error:", err));
}
module.exports={connectToDB};