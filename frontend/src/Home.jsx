
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FaUpload } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import "./App.css";


const socket = io("http://localhost:5005", {
  transports: ["websocket"], 
});

const Home = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    socket.on("receiveMessage", (response) => {
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setResponses((prev) => [...prev, { text: response, sender: "bot", timestamp }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim() !== "" || file) {
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Send text message
      if (message.trim() !== "") {
        setResponses((prev) => [
          ...prev,
          { text: message, sender: "user", timestamp },
        ]);
        socket.emit("sendMessage", message);
        setMessage("");
      }

      // send file if selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("http://localhost:5005/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            console.log("File uploaded successfully");
            setResponses((prev) => [
              ...prev,
              { text: `File uploaded: ${file.name}`, sender: "bot", timestamp },
            ]);
            setFile(null); 
          } else {
            console.error("Failed to upload file");
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent default behavior (newline)
      sendMessage();
    }
  };

  return (
    <div style={{display: "flex", width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center"}}>
    <div style={{ width: "60%", height: "80%",backgroundColor: "#1F1D1D", fontFamily: "Inter, sans-serif", margin: 40, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"}}>
      {/* Chat Window Header */}
      <div style={{ width: "100%", height: 96, backgroundColor: "#000000", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25) inset", display: "flex", alignItems: "center", paddingLeft: 20}}>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: "600" }}>Virtual Private Assistant</h2>
      </div>

      {/* Chat Messages */}
      <div style={{ width: "100%", height: "calc(100% - 200px)", overflowY: "auto", padding: 20 }}>
        {responses.map((msg, index) => (
          <div
            key={index}
            style={{
              backgroundColor: msg.sender === "user" ? "#5672F6" : "#312F2F",
              borderRadius: 15,
              padding: "8px 16px",
              marginBottom: 10,
              width: "fit-content",
              maxWidth: "70%",
              marginLeft: msg.sender === "user" ? "auto" : 0,
            }}
          >
            <p style={{ color: "white", fontSize: 16, fontWeight: "600", margin: 0 }}>
              {msg.text}
            </p>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12, margin: "4px 0 0 0" }}>
              {msg.timestamp}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Input Section */}
      <div
        style={{
          width: "100%",
          height: 100,
          backgroundColor: "#1F1D1D",
          bottom: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* File Upload Button */}
        <label style={{ marginRight: 10, cursor: "pointer" }}>
          <FaUpload size={20} color="white" />
          <input type="file" onChange={handleFileChange} hidden />
        </label>

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type anything..."
          style={{
            flex: 1,
            height: 50,
            backgroundColor: "#312F2F",
            borderRadius: 30,
            border: "none",
            padding: "0 20px",
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            marginRight: 10,
          }}
        />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#5672F6",
            borderRadius: "50%",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <MdSend size={20} color="white" />
        </button>
      </div>

      {/* Display Selected File Name with Remove Option */}
      {file && (
        <div style={{ position: "absolute", bottom: 120, left: 20, color: "white", fontSize: 14, display: "flex", alignItems: "center" }}>
          <span>Selected file: {file.name}</span>
          <button
            onClick={() => setFile(null)} // Clear the selected file
            style={{
              marginLeft: 10,
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            (Remove)
          </button>
        </div>
      )}
    </div></div>
  );
};

export default Home;
