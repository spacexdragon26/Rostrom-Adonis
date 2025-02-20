const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Allow requests from your React frontend (port 3000)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = 5005;

// Hardcoded responses
const RESPONSES = {
  hello: "Hi there!",
  wassup : "I'm just a bot, but I'm good!",
  bye: "Goodbye!",
};

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", (message) => {
    console.log("Received:", message);
    
    // Get a response or fallback message
    const response = RESPONSES[message.toLowerCase()] || "I don't understand that.";
    
    // Send back the response
    socket.emit("receiveMessage", response);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
