import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate(); 
  const handleLoginClick = () => {
    navigate("/login"); 
  };

  const handleRegisterClick = () => {
    navigate("/register"); 
  };
  return (
    <div className="welcome-body"> 
      <div className="welcome-container">
        <h1>Solar Cell Maintenance System</h1>
        <img src="logo192.png" alt="Logo" />
        <button className="login-btn" onClick={handleLoginClick}>
          <h1>Login</h1>
        </button>
        <button className="regis-btn" onClick={handleRegisterClick}>
          <h1>Register</h1>
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
