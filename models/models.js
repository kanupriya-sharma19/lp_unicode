const mongoose=require('mongoose');
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
module.exports = { person};