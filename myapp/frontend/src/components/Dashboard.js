import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css"

const Dashboard = () => {
  const [username, setUsername] = useState(""); 
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/"); // ถ้าไม่มี token ให้ไปหน้า login
    } else {
        axios.get("http://localhost:5000/auth/user", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("API response:", response.data);
            setUsername(response.data.username); // เก็บ username จาก database
            setRoles(response.data.roles); // เก็บ roles ที่ได้จากฐานข้อมูล
            setPermissions(response.data.permissions); // เก็บ permissions ที่ได้จากฐานข้อมูล
            console.log("Permissions after set:", response.data.permissions);
        })
        .catch(error => {
            if (error.response) {
                console.error("Error response:", error.response);  
            } else if (error.request) {
                console.error("Error request:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            navigate("/");  
        });
    }
}, [navigate]);

  const handleRoleClick = (role) => {
    setSelectedRole(role); // เมื่อกดปุ่ม role, ให้เก็บ role นั้นใน selectedRole
  };

  // ฟังก์ชันตรวจสอบว่า user มี permission หรือไม่
  const hasPermission = (permission) => {
    console.log("add permission:", permission);
    console.log("Checking permission:", permissions);
    return permissions.includes(permission);
  };

  console.log(username)

  return (
    <div class="body">
      
      <div class="user-bar">
        
        <div class="username-info">
          <img src="logo192.png" class="profile-img" alt="profile-picture"/>
          <h3>
            {username}
          </h3>
        </div>

        <button onClick={() => {
          localStorage.clear();
          navigate("/");  // Logout
        }} class="hub-btn">Logout
        </button>

      </div>

      <div class="user-info">
        
        <div class="hello-user">
          <h1>Hello, {username}</h1>
          <h2>system time... last update....</h2>
        </div>

        <div class="user-activity">
          <h3>last act is ....</h3>
        </div>
        
      </div>

      <hr></hr>

      <div class="manage-panel">
        <div class="role-select">
          <h1>Management Panel</h1>
          {/* แสดงปุ่มสำหรับเลือก role */}
            {roles.includes("admin") && (
              <button onClick={() => handleRoleClick("admin")} class="hub-btn">Administrator</button>
            )}
            {roles.includes("dc") && (
              <button onClick={() => handleRoleClick("dc")} class="hub-btn">DC</button>
            )}
            {roles.includes("da") && (
              <button onClick={() => handleRoleClick("da")} class="hub-btn">Analyst</button>
            )}
        </div>
        
        <div class="role-interact">
          {/* แสดงปุ่มตาม role ที่ถูกเลือก */}
          {selectedRole === null && (
            <>
            <h4>Please Select Your Role.</h4>            
            </>
          )}
          {selectedRole === "admin" && (
            <>
            <div class="cards">
              {hasPermission("manage_users") && <button class="card-btn">
                  <img src="logo192.png" alt="User Manage Dashboard Pic"/>
                  <h2>User Manage Dashboard</h2>
                  <h3>Assign Roles</h3>
                  <h3>Manage Users</h3>
                  <h3>View Logs</h3>
                  </button>}
              {hasPermission("manage_solar_plants") && <button class="card-btn">
                <img src="logo192.png" alt="Solar Plant Manage Dashboard Pic"/>
                <h2>Solar Plant Manage Dashboard</h2>
                <h3>Create, Modify, Remove Solar Plant.</h3>
                </button>}
              </div>
              <h5>As an Admin, you can Manage and track user activity. Oversee and manage all solar power plants</h5>
            </>
          )}
          {selectedRole === "dc" && (
            <>
              {hasPermission("view_solar_plants") && <button class="card-btn">Task board</button>}
              {hasPermission("control_drones") && <button class="card-btn">Create Task</button>}
            </>
          )}
          {selectedRole === "da" && (
            <>
              {hasPermission("view_reports") && <button class="card-btn">Zone Dashboard</button>}
              {hasPermission("analyze_data") && <button class="card-btn">Analysis result</button>}
              {hasPermission("analyze_data") && <button class="card-btn">API Dashboard</button>}
            </>
          )}
        </div>
      
      </div>
    
    
    </div>
  


  );
};

export default Dashboard;
