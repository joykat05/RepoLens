import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    owner: String,
    name: String,
    defaultBranch: String,
    status: {
      type: String,
      enum: ["pending", "indexing", "ready", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Repository", repositorySchema);