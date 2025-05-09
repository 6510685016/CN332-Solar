import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate(); 

  return (
    <div className="welcome-body"> 
      <div className="welcome-container">
        <img src="logo192.png" alt="Logo" />
        <h1>Solar Cell Maintenance System</h1>
        <div className="button-group">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="regis-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
