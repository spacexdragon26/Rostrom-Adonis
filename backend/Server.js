const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());

// Allow requests from your React frontend (port 3000)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect
    methods: ["GET", "POST"],
  },
});

const PORT = 5005;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
const fs = require("fs");
const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Hardcoded responses
const RESPONSES = {
  hello: "Hi there!",
  "how are you": "I'm just a bot, but I'm good!",
  bye: "Goodbye!",
};

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for messages from the frontend
  socket.on("sendMessage", (message) => {
    console.log("Received:", message);

    // Get a response or fallback message
    const response = RESPONSES[message.toLowerCase()] || "I don't understand that.";

    // Send the response back to the frontend
    socket.emit("receiveMessage", response);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Endpoint to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("File uploaded:", req.file.filename);
  res.status(200).send("File uploaded successfully.");
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
