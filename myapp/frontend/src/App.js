import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import WelcomePage from "./components/WelcomePage";
import UserManage from "./components/UserManage";
import SolarPlantManage from "./components/SolarPlantManage";
import CreateSolarPlant from "./components/CreateSolarPlant";
import CreateZone from "./components/CreateZone";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usermanage" element={<UserManage />} />
          <Route path="/solarplantmanage" element={<SolarPlantManage />} />
          <Route path="/createsolarplant" element={<CreateSolarPlant />} />
          <Route path="/createzone" element={<CreateZone />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
