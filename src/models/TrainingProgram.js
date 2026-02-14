import mongoose from "mongoose";
// populate("userId") kullanımı için User modelinin kayıtlı olması gerekir
import "./User";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true, min: 1 },
    // Sabit (12) veya aralık (10-12) olabilir
    reps: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(v) {
          if (!v) return false;
          const s = String(v).trim();
          if (!s) return false;
          const single = /^\d+$/.test(s);
          const range = /^\d+\s*-\s*\d+$/.test(s);
          return single || range;
        },
        message: "Tekrar: sabit sayı (12) veya aralık (10-12) girin.",
      },
    },
    // Opsiyonel: Hareket kütüphanesi entegrasyonu
    movementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movement",
      required: false,
    },
    videoUrl: {
      type: String,
      required: false,
      trim: true,
    },
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
