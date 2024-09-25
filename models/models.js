import mongoose from 'mongoose';
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
      
    },profileImage:{type:String}
});
const person = mongoose.model('person', schema);
export { person};