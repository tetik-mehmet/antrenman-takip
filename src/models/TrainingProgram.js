import mongoose from "mongoose";
// populate("userId") kullanımı için User modelinin kayıtlı olması gerekir
import "./User";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true, min: 1 },
    reps: { type: Number, required: true, min: 1 },
  },
  { _id: true }
);

const daySchema = new mongoose.Schema(
  {
    dayName: { type: String, required: true },
    exercises: [exerciseSchema],
  },
  { _id: true }
);

const trainingProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: String,
      enum: ["ADMIN", "USER"],
      required: true,
    },
    days: [daySchema],
  },
  { timestamps: true }
);

export default mongoose.models.TrainingProgram ||
  mongoose.model("TrainingProgram", trainingProgramSchema);
