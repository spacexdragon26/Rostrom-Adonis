import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  // Use navigate for routing

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    alert(data.message);
    
    if (response.ok) {
      alert(data.message);
      navigate("/home"); // Navigate to Home.jsx on success
    } else {
      alert(data.message); // Show error message if signup fails
    }
};

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "white" }}>
      <div className="rounded border shadow-lg text-center" style={{ backgroundColor: "white", width: "40%", borderRadius: "20px"}}>
        <div className="p-2"  style={{ backgroundColor: "#000435", fontFamily: "Lexend" , color: "white"}}><h2 className="m-3">Create an account</h2></div>
        <div className="m-2 p-3"><form onSubmit={handleSignup}>
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn m-3" style={{ backgroundColor: "#000435", fontFamily: "Lexend" , color: "white", width: "50%", height: "50px"}}>
            Sign Up
          </button>
        </form>
        <p>Login to your account</p></div>
        
      </div>
    </div>
  );
};

export default Signup;
