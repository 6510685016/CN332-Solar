// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <GoogleOAuthProvider clientId="182120910680-1a9e8dulevbqou4n8fnjlep8ht2lq71l.apps.googleusercontent.com">
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
