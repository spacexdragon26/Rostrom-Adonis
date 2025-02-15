import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FaUpload } from "react-icons/fa";
import { MdSend} from "react-icons/md";
import "./App.css";

const socket = io("http://localhost:5005"); // Connect to backend WebSocket server

const Home = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [file, setFile] = useState(null);

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

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("Selected file:", uploadedFile.name);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="outer-container">
        <h2 className="text-center">VPA</h2>

        <div className="chat-box d-flex flex-column">
          {responses.map((msg, index) => (
            <p
              key={index}
              className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              {msg.text}
            </p>
          ))}
        </div>

        <div className="chat-input-container">
          {/* File Upload Button */}
          <label className="upload-button">
            <FaUpload size={20} />
            <input type="file" onChange={handleFileChange} hidden />
          </label>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}><MdSend size={20} style={{alignItems: "center"}}/></button>
          
          
        </div>

        <div className="file-name">{file && <p style={{textAlign: "center", margin: "5px"}}>Selected file: {file.name}</p>}</div>
        
      </div>
    </div>
  );
};

export default Home;
