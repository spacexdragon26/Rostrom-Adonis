import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5005"); // Connect to backend WebSocket server

const Home = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (response) => {
      setResponses((prev) => [...prev, { text: response, sender: "bot" }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      setResponses((prev) => [...prev, { text: message, sender: "user" }]);
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="outer-container">
        <h2 className="text-center">Chatbot</h2>
        
        <div className="chat-box d-flex flex-column">
          {responses.map((msg, index) => (
            <p
              key={index}
              className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              <strong>{msg.sender === "user" ? "You: " : "Bot: "}</strong> {msg.text}
            </p>
          ))}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
