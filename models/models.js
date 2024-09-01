const mongoose=require('mongoose');
connectToDB=()=>{
    mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.error("DB connection error:", err));
}
const schema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
      
    }
});
const person = mongoose.model('person', schema);
module.exports = { person, connectToDB };