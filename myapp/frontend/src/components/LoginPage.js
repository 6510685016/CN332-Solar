import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./LoginPage.css"

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);  // เก็บ token ไว้ใน localStorage
      navigate('/dashboard');  // ไปที่หน้า Dashboard
    } catch (error) {
      setErrorMessage(error.response.data.msg || 'Login failed');
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response;
      const googleToken = credential;

      const googleResponse = await axios.post('http://localhost:5000/auth/google/callback', { googleToken });

      localStorage.setItem('token', googleResponse.data.token);  // เก็บ token
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage('Google login failed');
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.log('Google login error', error);
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

      <hr />

      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginFailure}
      />
      </div>
    </div>
  );
};

export default LoginPage;
