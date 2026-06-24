require("dotenv").config();

const bcrypt = require("bcryptjs");
const { connectDB } = require("./db");
const Admin = require("./models/Admin");

const emailArg = process.argv[2];
const passwordArg = process.argv[3];
const email = (process.env.ADMIN_EMAIL || emailArg || null);
const password = process.env.ADMIN_PASSWORD || passwordArg || null;

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be provided via environment variables or command-line arguments.");
  console.error("Usage: node server/updateAdmin.js <email> <password> OR set ADMIN_EMAIL and ADMIN_PASSWORD in environment.");
  process.exit(1);
}

// normalize email
const normalizedEmail = email.toLowerCase();

async function updateAdmin() {
  await connectDB();

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await Admin.findOne();

  if (admin) {
    admin.email = normalizedEmail;
    admin.passwordHash = passwordHash;
    await admin.save();
    console.log(`Admin updated: ${normalizedEmail}`);
  } else {
    await Admin.create({ email: normalizedEmail, passwordHash });
    console.log(`Admin created: ${normalizedEmail}`);
  }

  process.exit(0);
}

updateAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
