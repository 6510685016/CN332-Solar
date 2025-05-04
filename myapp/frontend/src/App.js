import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import WelcomePage from "./components/WelcomePage";
import UserManage from "./components/UserManage";
import SolarPlantManage from "./components/SolarPlantManage";
import SolarPlantInfo from "./components/SolarPlantInfo";
import CreateSolarPlant from "./components/CreateSolarPlant";
import CreateZone from "./components/CreateZone";
import TaskPage from "./components/TaskPage";
import TaskManage from "./components/TaskManage";
import CreateTask from "./components/CreateTask";
import ViewTask from "./components/ViewTask";
import EditTask from "./components/EditTask";

import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
        // public routes
          <Route path="/" element={<WelcomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        // login and register routes
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        // admin routes
          <Route path="/usermanage" element={<UserManage />} />
          <Route path="/solarplantmanage" element={<SolarPlantManage />} />
          <Route path="/solarplantinfo/:plantId?" element={<SolarPlantInfo />} />
          <Route path="/createsolarplant" element={<CreateSolarPlant />} />
          <Route path="/createzone" element={<CreateZone />} />
        // drone controller routes
          <Route path="/taskmanage" element={<TaskManage />} />
          <Route path="/createtask" element={<CreateTask />} />
          <Route path="/edittask/:taskId" element={<EditTask />} />
          <Route path="/viewtask/:taskId" element={<ViewTask />} />
        // analyst routes
          <Route path="/task" element={<TaskPage />} /> // analyst and drone controller
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
