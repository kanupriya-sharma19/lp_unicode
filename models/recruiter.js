import mongoose from 'mongoose';

const schema= new mongoose.Schema({
Name:{type:String,required:true,},
    Email:{
        type:String,
        required:true,
        unique: true,
        lowercase:true
    },
    CompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
   
    Description:{type:String,required:true,},

    
});
const Recruiters= mongoose.model('Recruiters', schema);
export {Recruiters};