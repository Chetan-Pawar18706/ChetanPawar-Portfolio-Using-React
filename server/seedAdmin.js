require("dotenv").config();

const bcrypt = require("bcryptjs");
const { connectDB } = require("./db");
const Admin = require("./models/Admin");

async function seedAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.");
    process.exit(1);
  }
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
