const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const testcaseRoutes = require("./routes/testcaseRoutes");
const statsRoutes = require("./routes/statsRoutes");

const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const { executeC } = require('./executeC');
const { executePython } = require('./executePython');
const { executeJava } = require('./executeJava');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:80',
    'http://localhost:5173',
    'http://127.0.0.1',
    'http://127.0.0.1:80',
    'http://127.0.0.1:5173',
    'http://client',
    'http://client:80'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Log all incoming requests
app.use((req, res, next) => {
  const requestId = Math.random().toString(36).substring(2, 9);
  console.log(`[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    host: req.headers.host,
    referer: req.headers.referer,
    method: req.method,
    path: req.path
  });
  next();
});

// Parse JSON bodies
app.use(express.json());
// Routes
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Debug route to list all registered routes
app.get('/routes', (req, res) => {
  const routes = [];
  
  function printRoutes(layer, path = '') {
    if (layer.route) {
      // Routes registered directly on the app
      const route = layer.route;
      const methods = Object.keys(route.methods).map(method => method.toUpperCase()).join(',');
      routes.push(`${methods} ${path}${route.path}`);
    } else if (layer.name === 'router') {
      // Router middleware
      const routerPath = layer.regexp.toString()
        .replace('/^\\/?', '')
        .replace('(?:\\/(?=:))?', '')
        .replace('(?=\\/|$)', '')
        .replace('\\', '')
        .replace(/\?/g, '')
        .replace(/\$/g, '')
        .replace(/\\(\/|\?|\$)/g, '$1');
      
      layer.handle.stack.forEach(sublayer => {
        printRoutes(sublayer, `${path}${routerPath}`);
      });
    }
  }

  app._router.stack.forEach(layer => printRoutes(layer));
  res.json({ routes: routes.sort() });
});

// Debug endpoint to list all routes
app.get("/api/debug/routes", (req, res) => {
  const routes = [];
  
  // Extract routes from each router
  const processMiddleware = (stack, path = '') => {
    stack.forEach(middleware => {
      if (middleware.route) { // Routes registered directly on the app
        const route = middleware.route;
        Object.keys(route.methods).forEach(method => {
          routes.push(`${method.toUpperCase()} ${path}${route.path}`);
        });
      } else if (middleware.name === 'router') { // Router middleware
        if (middleware.handle.stack) {
          processMiddleware(middleware.handle.stack, path);
        }
      } else if (middleware.handle && middleware.handle.stack) { // Nested router
        processMiddleware(middleware.handle.stack, path);
      }
    });
  };

  // Process all middleware
  processMiddleware(app._router.stack);

  // Add mounted routes
  app._router.stack.forEach(middleware => {
    if (middleware.name === 'router') {
      const path = middleware.regexp.toString()
        .replace('/^', '')
        .replace('\/?(?=\/|$)/i', '')
        .replace(/\//g, '/');
      
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          Object.keys(handler.route.methods).forEach(method => {
            routes.push(`${method.toUpperCase()} /api${path}${handler.route.path}`);
          });
        }
      });
    }
  });

  res.json({ routes: routes.sort() });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/testcases", testcaseRoutes);
app.use("/api/stats", statsRoutes);

app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input = '' } = req.body;
    if (!code || code.trim() === '') {
        return res.status(400).json({ success: false, error: "Empty code! Please provide some code to execute." });
    }
    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        let output;
        if (language === 'cpp') {
            output = await executeCpp(filePath, inputPath);
        } else if (language === 'c') {
            output = await executeC(filePath, inputPath);
        } else if (language === 'python') {
            output = await executePython(filePath, inputPath);
        } else if (language === 'java') {
            output = await executeJava(filePath, inputPath);
        } else {
            throw new Error('Unsupported language');
        }
        res.json({ success: true, output });
    } catch (error) {
        res.status(500).json({ success: false, error: error.stderr || error.error || error.message || 'Execution error' });
    }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000 and DB connected");
    });
  })
  .catch((err) => console.error("DB connection error:", err));
