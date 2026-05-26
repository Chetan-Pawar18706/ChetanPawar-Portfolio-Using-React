require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDb = require("./db");
const Admin = require("./models/Admin");

async function seedAdmin() {
  await connectDb();

  const email = (process.env.ADMIN_EMAIL || "admin@portfolio.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash });
  console.log(`Admin created: ${email}`);
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
