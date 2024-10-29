import mongoose from "mongoose";
const BlogSchema = new mongoose.Schema({
  Author_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "AuthorType",
  },
  AuthorType: {
    type: String,
    enum: ["person", "Company"],
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Content: {
    type: String,
    required: true,
  },
  Tags: [
    {
      type: String,
    },
  ],
  Created_at: {
    type: Date,
    default: Date.now,
  },
});
const Blog = mongoose.model("Blog", BlogSchema);
export { Blog };
