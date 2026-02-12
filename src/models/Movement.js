import mongoose from "mongoose";

const movementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

movementSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Movement ||
  mongoose.model("Movement", movementSchema);
