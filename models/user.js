import mongoose from "mongoose";
const schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: [true,"Lower hai"],
  },
  Password: {
    type: String,
    required: true,
  },
  Profile_Image: { type: String,default: "No profile pic" },
  Resume: { type: String ,default: "No resume"},
  Tech_Stack: {
    Stacks: {
      type: [String],
    
    },
  },

  Bio: { type: String, required: false, default: "New Here!" },
});
const person = mongoose.model("person", schema);
export { person };
