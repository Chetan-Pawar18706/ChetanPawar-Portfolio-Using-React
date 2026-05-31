require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const { connectDB, getMongoStatus } = require("./db");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const pageRoutes = require("./routes/pages");
const messageRoutes = require("./routes/messages");

const app = express();

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "development";
const projectRoot = path.resolve(__dirname, "..");
const distPath = path.join(projectRoot, "dist");
const hasFrontendBuild = fs.existsSync(path.join(distPath, "index.html"));
const isProduction = environment === "production";

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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

    return callback(
      new Error(`CORS blocked for origin: ${origin}`),
      false
    );
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

const assetPaths = [
  path.join(projectRoot, "assets"),
  path.join(process.cwd(), "assets"),
  path.join(distPath, "assets"),
].filter((assetPath) => fs.existsSync(assetPath));

if (assetPaths.length === 0) {
  console.warn(
    "WARNING: No /assets directory was found for static asset serving. Checked:",
    [
      path.join(projectRoot, "assets"),
      path.join(process.cwd(), "assets"),
      path.join(distPath, "assets"),
    ].join(", ")
  );
} else {
  assetPaths.forEach((assetPath) => {
    console.log(`Serving /assets from: ${assetPath}`);
    app.use("/assets", express.static(assetPath));
  });
}

if (hasFrontendBuild) {
  app.use(express.static(distPath));
}

/* ---------------------------
   Basic Routes
---------------------------- */

app.get("/", (req, res) => {
  if (hasFrontendBuild) {
    return res.sendFile(path.join(distPath, "index.html"));
  }

  return res.status(200).json({
    status: "ok",
    service: "portfolio-backend",
    environment,
    health: "/health",
    pages: {
      home: "/api/pages/home",
      contact: "/api/pages/contact",
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    environment,
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: getMongoStatus(),
  });
});

/* ---------------------------
   API Routes
---------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/messages", messageRoutes);

/* ---------------------------
   React SPA Fallback
   Express 5 Compatible
---------------------------- */

if (hasFrontendBuild) {
  app.use((req, res, next) => {
    if (
      req.method !== "GET" ||
      req.originalUrl.startsWith("/api") ||
      req.originalUrl.startsWith("/assets")
    ) {
      return next();
    }

    return res.sendFile(path.join(distPath, "index.html"));
  });
}

/* ---------------------------
   404 Handler
---------------------------- */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

/* ---------------------------
   Global Error Handler
---------------------------- */

app.use((error, req, res, next) => {
  const status =
    error.status ||
    error.statusCode ||
    (error.name === "ValidationError" ? 400 : 500);

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid resource id",
    });
  }

  console.error(
    `${req.method} ${req.originalUrl} failed:`,
    error
  );

  return res.status(status).json({
    message:
      status >= 500
        ? "Internal server error"
        : error.message,
  });
});

/* ---------------------------
   Startup Logging
---------------------------- */

function logStartup(dbStatus) {
  console.log("================================");
  console.log(`Environment: ${environment}`);
  console.log(`Server Port: ${port}`);
  console.log(
    `MongoDB Status: ${
      dbStatus.connected ? "CONNECTED" : "NOT CONNECTED"
    }`
  );
  console.log(
    `Database: ${
      dbStatus.database ||
      dbStatus.reason ||
      getMongoStatus().state
    }`
  );
  console.log(
    `Allowed Origins: ${allowedOrigins.join(", ")}`
  );
  console.log(`Routes Loaded: ${loadedRoutes.length}`);
  console.log("================================");
}

/* ---------------------------
   Start Server
---------------------------- */

async function startServer() {
  try {
    const dbStatus = await connectDB();

    app.listen(port, () => {
      logStartup(dbStatus);

      console.log(
        `🚀 Server running on port ${port}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start API:",
      error.message
    );
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer,
  loadedRoutes,
};