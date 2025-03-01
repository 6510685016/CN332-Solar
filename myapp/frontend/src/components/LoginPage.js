import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
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
      const response = await axios.post("http://localhost:5000/auth/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token); // เก็บ token ใน localStorage
      navigate("/dashboard"); // ไปที่หน้า Dashboard
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Login failed");
    }
  };

  const handleClick = () => {
    const callbackUrl = `${window.location.origin}`;
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token'); // Get the 'token' parameter from the URL
  
    if (accessToken) {
      // User logged in with Google and the access_token is in the URL
      const loginWithGoogle = async () => {
        try {
          const response = await axios.post("http://localhost:5000/auth/google", { accessToken });
          const { token } = response.data; // Assuming the backend returns a JWT token
          
          localStorage.setItem("token", token); // Store the token in localStorage
          navigate("/dashboard"); // Navigate to the dashboard
        } catch (error) {
          setErrorMessage(error.response?.data?.msg || "Login failed"); // Set error message
        }
      };

      loginWithGoogle(); // Call the login function
    }
  }, [navigate]);

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

      <hr />
      <button className="btn btn-primary"
        onClick={handleClick}>
        <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 326667 333333"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd"
              width={20}
              height={20}
            >
              <path
                d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z"
                fill="#4285f4"
              />
              <path
                d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z"
                fill="#34a853"
              />
              <path
                d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z"
                fill="#fbbc04"
              />
              <path
                d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z"
                fill="#ea4335"
              />
            </svg>
      </button>
    </div>
  );
};

export default LoginPage;
