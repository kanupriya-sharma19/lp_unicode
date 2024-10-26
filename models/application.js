import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'person', 
        required: true
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job', 
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending', 
        required: true
    },
    applied_date: {
        type: Date,
        default: Date.now, 
        required: true
    }
});

const Application = mongoose.model('Application', applicationSchema);

export{Application};
