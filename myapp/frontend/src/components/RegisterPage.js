import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google"; 
import "./RegisterPage.css";

const RegisterPage = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/register", { username, email, password });
      navigate("/"); 
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Registration failed");
    }
  };

  
  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response;
      const googleToken = credential;

      const googleResponse = await axios.post("http://localhost:5000/auth/google/callback", { googleToken });

      localStorage.setItem("token", googleResponse.data.token);
      navigate("/dashboard"); 
    } catch (error) {
      setErrorMessage("Google login failed");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.log("Google login error", error);
    setErrorMessage("Google login failed");
  };

  return (
    <div className="reg-body">
      <div className="reg-img"></div>
      <div className="reg-right">
        <div className="reg-form">
          <h2>Register</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Name:</label>
              <input type="text" value={username} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn-register">Register</button>
          </form>

          <div className="google-login">
                <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginFailure} />
          </div>

          
          <p>Already have an account? <a href="/login" className="login-link">Login</a></p>

         
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
