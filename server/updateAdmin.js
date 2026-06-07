require("dotenv").config();

const bcrypt = require("bcryptjs");
const { connectDB } = require("./db");
const Admin = require("./models/Admin");

const email = (process.env.ADMIN_EMAIL || process.argv[2] || "chetanpawar@chetan.com").toLowerCase();
const password = process.env.ADMIN_PASSWORD || process.argv[3] || "chetan@18706";

async function updateAdmin() {
  await connectDB();

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await Admin.findOne();

  if (admin) {
    admin.email = email;
    admin.passwordHash = passwordHash;
    await admin.save();
    console.log(`Admin updated: ${email}`);
  } else {
    await Admin.create({ email, passwordHash });
    console.log(`Admin created: ${email}`);
  }

  process.exit(0);
}

updateAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
