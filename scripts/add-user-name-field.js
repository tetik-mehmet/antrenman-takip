/**
 * Tüm kullanıcı kayıtlarına "name" alanı ekler (yoksa boş string).
 * MongoDB'de name alanı böylece görünür ve güncellemeler çalışır.
 * Kullanım: node scripts/add-user-name-field.js  veya  npm run add-name-field
 * Not: MONGODB_URI ortam değişkeni veya .env.local gerekebilir.
 */

const fs = require("fs");
const path = require("path");

// .env.local veya .env'den MONGODB_URI oku (dotenv yoksa)
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.resolve(process.cwd(), file);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf8");
      for (const line of content.split("\n")) {
        const m = line.match(/^\s*MONGODB_URI\s*=\s*(.+)/);
        if (m)
          process.env.MONGODB_URI = m[1].trim().replace(/^["']|["']$/g, "");
      }
      break;
    }
  }
}
loadEnv();

const mongoose = require("mongoose");
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gym-app";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const result = await mongoose.connection.db
    .collection("users")
    .updateMany({ name: { $exists: false } }, { $set: { name: "" } });
  console.log("Güncellenen kullanıcı sayısı:", result.modifiedCount);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
