import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './LoginPage.css';

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
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Login failed");
    }
  };

  const handleGoogleLogin = async (credential) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/auth/google`, { credential });
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="login-body">
      <button className="back-button" onClick={() => navigate("/")}>
          ⬅ Back
      </button>
      <div className="left-section">
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
            {errorMessage && <p>{errorMessage}</p>}
            <button type="submit">Login</button>
          </form>
          <button className="link-button" onClick={() => navigate("/register")}>
            Don't have an account? Register now
          </button>
          <hr />
          <GoogleLogin
            onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse)}
            onError={() => setErrorMessage("Google Login failed")}
          />
        </div>
      </div>
      <div className="right-section"></div>
    </div>
  );
};

export default LoginPage;
