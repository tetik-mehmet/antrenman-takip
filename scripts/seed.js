/**
 * Örnek veri oluşturur: 1 ADMIN, 1 USER, 2 örnek antrenman programı.
 * Kullanım: node scripts/seed.js
 * Not: MONGODB_URI gerekir (.env veya ortam değişkeni).
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gym-app";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  },
  { timestamps: true }
);

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
});

const daySchema = new mongoose.Schema({
  dayName: String,
  exercises: [exerciseSchema],
});

const trainingProgramSchema = new mongoose.Schema(
  {
    title: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: String, enum: ["ADMIN", "USER"] },
    days: [daySchema],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const TrainingProgram =
  mongoose.models.TrainingProgram ||
  mongoose.model("TrainingProgram", trainingProgramSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB bağlandı.");

  const existingAdmin = await User.findOne({ email: "admin@example.com" });
  if (existingAdmin) {
    console.log(
      "Örnek veri zaten mevcut. Çıkmak için mevcut kullanıcıları silin."
    );
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashedAdmin = await bcrypt.hash("admin123", 10);
  const hashedUser = await bcrypt.hash("user123", 10);

  await User.create({
    email: "admin@example.com",
    password: hashedAdmin,
    role: "ADMIN",
  });
  const user = await User.create({
    email: "user@example.com",
    password: hashedUser,
    role: "USER",
  });

  await TrainingProgram.create({
    title: "Haftalık Full Body",
    userId: user._id,
    createdBy: "ADMIN",
    days: [
      {
        dayName: "Pazartesi",
        exercises: [
          { name: "Bench Press", sets: 4, reps: 10 },
          { name: "Squat", sets: 4, reps: 12 },
        ],
      },
      {
        dayName: "Çarşamba",
        exercises: [
          { name: "Deadlift", sets: 3, reps: 8 },
          { name: "Overhead Press", sets: 3, reps: 10 },
        ],
      },
    ],
  });

  await TrainingProgram.create({
    title: "Kendi Programım",
    userId: user._id,
    createdBy: "USER",
    days: [
      {
        dayName: "Day 1",
        exercises: [
          { name: "Push-up", sets: 3, reps: 15 },
          { name: "Plank", sets: 3, reps: 30 },
        ],
      },
    ],
  });

  console.log("Seed tamamlandı.");
  console.log("  ADMIN: admin@example.com / admin123");
  console.log("  USER:  user@example.com / user123");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed hatası:", err);
  process.exit(1);
});
