// RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/auth/register`, { username, email, password });
      navigate("/"); // หลังจากลงทะเบียนสำเร็จให้ไปหน้า login
    } catch (error) {
      setErrorMessage(error.response.data.msg || "Registration failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", width: "300px" }}>
        <h2>Register</h2>
        {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "15px" }}>
            <label>Name:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}>
            Register
          </button>
        </form>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button onClick={() => navigate("/")} style={{ backgroundColor: "transparent", border: "none", color: "#007bff", cursor: "pointer" }}>
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
