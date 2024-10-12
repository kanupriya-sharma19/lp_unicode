import mongoose from 'mongoose';

const schema= new mongoose.Schema({
Name:{type:String,required:true},
Password:{type:String,required:true},
    Email:{
        type:String,
        required:true,
        unique: true,
        lowercase:true
    },
    Qualification:String, Current_position:String,Salary:String,
    CompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    
});
const Recruiters= mongoose.model('Recruiters', schema);
export {Recruiters};