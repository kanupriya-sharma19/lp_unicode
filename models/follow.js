import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  Following_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "FollowerType",
  },
  FollowerType: {
    type: String,
    enum: ["person", "Company"],
    required: true,
  },
  Follower_id: { type: mongoose.Schema.Types.ObjectId, ref: "person" },
  Follow_date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Follow = mongoose.model("Follow", Schema);

export { Follow };
