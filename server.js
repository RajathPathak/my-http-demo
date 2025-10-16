
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static("public")); // serve frontend files from /public

// Dummy user DB for demo
const user = { username: "rajath", password: "1234", city: "Unknown" };

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === user.username && password === user.password) {
    // set an httpOnly cookie (demo)
    res.cookie("sessionID", "abc123", { httpOnly: true, maxAge: 60_000 });
    // don't cache login responses
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ message: "Login successful (200 OK)" });
  }
  return res.status(401).json({ message: "Invalid credentials (401 Unauthorized)" });
});

// GET /api/profile
app.get("/api/profile", (req, res) => {
  // cache this response for 10 seconds (demo)
  res.setHeader("Cache-Control", "public, max-age=10");
  return res.status(200).json({
    username: user.username,
    city: user.city,
    message: "Profile fetched (200 OK)"
  });
});

// PUT /api/profile
app.put("/api/profile", (req, res) => {
  const { city } = req.body || {};
  if (city) user.city = city;
  // return 201 to demonstrate Created/Updated
  return res.status(201).json({ message: "Profile updated (201 Created)" });
});

// DELETE /api/profile
app.delete("/api/profile", (req, res) => {
  // demo: respond with 204 No Content
  return res.status(204).send();
});

// GET /api/logout
app.get("/api/logout", (req, res) => {
  res.clearCookie("sessionID");
  return res.status(200).json({ message: "Logged out (200 OK)" });
});

// OPTIONS handler for preflight (demo)
app.options(/.*/, (req, res) => {
  res.setHeader("Allow", "GET,POST,PUT,DELETE,OPTIONS");
  return res.status(204).end();
});

// Error demo route
app.get("/api/error", (req, res) => {
  return res.status(500).json({ message: "Server error demo (500)" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
