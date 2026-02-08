import mongoose from "mongoose";
import "./User";

const programRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "DONE"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ProgramRequest ||
  mongoose.model("ProgramRequest", programRequestSchema);
