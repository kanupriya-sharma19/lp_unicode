import mongoose from "mongoose";
const schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Profile_Image: { type: String, required: false, default: "No profile pic" },
  Resume: { type: String, required: true },
  Tech_Stack: {
    Stacks: {
      type: [String],
      required: true,
    },
  },

  Bio: { type: String, required: false, default: "New Here!" },
});
const person = mongoose.model("person", schema);
export { person };
