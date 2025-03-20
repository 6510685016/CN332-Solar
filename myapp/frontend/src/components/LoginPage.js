import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./LoginPage.css"

const LoginPage = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/auth/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token); // เก็บ token ใน localStorage
      navigate("/dashboard"); // ไปที่หน้า Dashboard
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Login failed");
    }
  };

  const handleGoogleLogin = async (credential) => {
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/auth/google`, { credential });
      const { token } = response.data;
      localStorage.setItem("token", token); // เก็บ token ใน localStorage
      navigate("/dashboard"); // ไปที่หน้า Dashboard
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="input-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && <h5 style={{ color: 'red' }}>{errorMessage}</h5>}
          <button type="submit">Login</button>
        </form>
        <button onClick={() => navigate("/register")} style={{ backgroundColor: "transparent", border: "none", color: "#007bff", cursor: "pointer" }}>
          Don't have an account? Register now
        </button>
        <hr/>
        <GoogleLogin
          onSuccess={ credential => {
            handleGoogleLogin(credential);
            console.log(credential);
          }}
          onError={ error => {
            setErrorMessage(error.response?.data?.msg || "Login failed");
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
