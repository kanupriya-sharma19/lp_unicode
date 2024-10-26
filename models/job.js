import mongoose from "mongoose";
const JobSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Requirements: {
        type: [String],
        required: true
    },
    Salary_range: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Job_type: {
        type: String,
        enum: ['full-time', 'part-time', 'remote'], 
    },
    Recruiter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiters', 
        required: true
    },
    Company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', 
        required: true
    }
}); 


const Job = mongoose.model('Job', JobSchema);

export { Job};
