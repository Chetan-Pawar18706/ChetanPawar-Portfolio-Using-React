require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB, getMongoStatus } = require("./db");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const pageRoutes = require("./routes/pages");
const messageRoutes = require("./routes/messages");

const app = express();
const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "development";
const allowedOrigins = [
  "https://chetanpawar-portfolio-using-react.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];
const loadedRoutes = [
  "GET /",
  "GET /health",
  "GET /api/health",
  "POST /api/auth/login",
  "GET /api/auth/me",
  "GET /api/projects",
  "POST /api/projects",
  "PUT /api/projects/:id",
  "DELETE /api/projects/:id",
  "GET /api/pages",
  "GET /api/pages/:slug",
  "POST /api/pages/:slug",
  "PUT /api/pages/:slug/:id",
  "DELETE /api/pages/:slug/:id",
  "GET /api/messages",
  "POST /api/messages",
  "PATCH /api/messages/:id",
  "DELETE /api/messages/:id",
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.disable("x-powered-by");
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "portfolio-backend",
    health: "/health",
    pages: {
      home: "/api/pages/home",
      contact: "/api/pages/contact",
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/messages", messageRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  const status = error.status || error.statusCode || (error.name === "ValidationError" ? 400 : 500);

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  console.error(`${req.method} ${req.originalUrl} failed: ${error.message}`);
  return res.status(status).json({
    message: status >= 500 ? "Internal server error" : error.message,
  });
});

function logStartup(dbStatus) {
  console.log(`Environment: ${environment}`);
  console.log(`Server port: ${port}`);
  console.log(`MongoDB status: ${dbStatus.connected ? "connected" : "not connected"} (${dbStatus.database || dbStatus.reason || getMongoStatus().state})`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
  console.log(`Loaded routes: ${loadedRoutes.join(", ")}`);
}

async function startServer() {
  const dbStatus = await connectDB();

  app.listen(port, () => {
    logStartup(dbStatus);
    console.log(`API running at http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start API:", error.message);
    process.exit(1);
  });
}

module.exports = {
  app,
  startServer,
  loadedRoutes,
};
