const mongoose = require("mongoose");

function getMongoUri() {
  return process.env.MONGO_URI || process.env.MONGODB_URI || "";
}

function getMongoStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    state: states[mongoose.connection.readyState] || "unknown",
    readyState: mongoose.connection.readyState,
    database: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  };
}

async function connectDB() {
  const uri = getMongoUri();

  if (!uri) {
    console.warn("MongoDB connection skipped: MONGO_URI or MONGODB_URI is not configured");
    return { connected: false, reason: "missing-uri", ...getMongoStatus() };
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    const status = getMongoStatus();
    console.log(`MongoDB connected: ${status.database || "unknown database"}`);
    return { connected: true, ...status };
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return { connected: false, reason: error.message, ...getMongoStatus() };
  }
}

module.exports = {
  connectDB,
  getMongoStatus,
};
