import mongoose from "mongoose";

const schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Website: {
    type: String,
    required: true,
  },
  Industry: { type: String },
  Recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recruites" }],
  Description: { type: String, required: true },
});
const Company = mongoose.model("Company", schema);
export { Company };
