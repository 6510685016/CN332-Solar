import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [username, setUsername] = useState(""); 
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); 
    } else {
      axios.get(`${process.env.REACT_APP_BACKEND}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUsername(response.data.username);
        setRoles(response.data.roles);
        setPermissions(response.data.permissions);

        // โหลด role ล่าสุดจาก localStorage หรือใช้ role แรกในลิสต์
        const savedRole = localStorage.getItem("selectedRole");
        if (savedRole && response.data.roles.includes(savedRole)) {
          setSelectedRole(savedRole);
        } else if (response.data.roles.length > 0) {
          setSelectedRole(response.data.roles[0]); 
          localStorage.setItem("selectedRole", response.data.roles[0]);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        navigate("/login");  
      });
    }
  }, [navigate]);

  const handleRoleClick = (role) => {
    const newRole = selectedRole === role ? null : role;
    setSelectedRole(newRole);

    // บันทึก role ลง localStorage
    if (newRole) {
      localStorage.setItem("selectedRole", newRole);
    } else {
      localStorage.removeItem("selectedRole");
    }
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString()); 
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  let userName = username
  if (userName.length > 10) {
    userName = userName.substring(0, 10) + "...";
  }

  return (
    <div className="body">
      <div className="user-bar">
        <div className="username-info">
          <img src="logo192.png" className="profile-img" alt="profile-picture"/>
          <h3>{userName}</h3>
        </div>
        <button onClick={() => {
          localStorage.clear();
          navigate("/login");
        }} className="hub-btn">Logout</button>
      </div>

      <div className="user-info">
        <div className="hello-user">
          <h1>Hello, {userName}</h1>
          <h2>System Time: {currentTime} last update....</h2>
        </div>
        <div className="user-activity">
          <h3>last act is ....</h3>
        </div>
      </div>

      <hr />

      <div className="manage-panel">
        <div className="role-select">
          <h1>Management Panel</h1>
          {roles.includes("admin") && (
            <button onClick={() => handleRoleClick("admin")} className="hub-btn">
              Administrator
            </button>
          )}
          {roles.includes("dc") && (
            <button onClick={() => handleRoleClick("dc")} className="hub-btn">
              Drone Controller
            </button>
          )}
          {roles.includes("da") && (
            <button onClick={() => handleRoleClick("da")} className="hub-btn">
              Data Analyst
            </button>
          )}
        </div>
        <div class="no-role">
        {roles.length === 0 && (
            <h5>No role has been assigned to you. <a href="www.example.com">Please contact the admin here.</a></h5>
          )}
        </div>

        <div className="role-interact">
          {selectedRole === "admin" && (
            <>
              <div className="cards">
                {hasPermission("manage_users") && (
                  <button className="card-btn">
                    <div className="header">
                      <img src="logo192.png" alt="User Manage Dashboard Pic" />
                      <h2>User Manage Dashboard</h2>
                    </div>
                    <div className="ability">
                      <h3>Assign Roles</h3>
                      <h3>Manage Users</h3>
                      <h3>View Logs</h3>
                    </div>
                  </button>
                )}
                {hasPermission("manage_solar_plants") && (
                  <button className="card-btn">
                    <div className="header">
                      <img src="logo192.png" alt="Solar Plant Manage Dashboard Pic" />
                      <h2>Solar Plant Manage Dashboard</h2>
                    </div>
                    <div className="ability">
                      <h3>Create, Modify, Remove Solar Plant.</h3>
                    </div>
                  </button>
                )}
              </div>
              <h5>As an Admin, you can Manage and track user activity. Oversee and manage all solar power plants</h5>
            </>
          )}

          {selectedRole === "dc" && (
            <>
              <div className="cards">
                {hasPermission("view_solar_plants") && (
                  <button className="card-btn">
                    <div className="header">
                      <img src="logo192.png" alt="Task Manage Dashboard Pic" />
                      <h2>Task Manage Dashboard</h2>
                    </div>
                    <div className="ability">
                      <h3>Monitor Zone</h3>
                      <h3>Status and Tasks</h3>
                    </div>
                  </button>
                )}
                {hasPermission("control_drones") && (
                  <button className="card-btn">
                    <div className="header">
                      <img src="logo192.png" alt="Create New Task Pic" />
                      <h2>Create New Task</h2>
                    </div>
                    <div className="ability">
                      <h3>Starting Analysis for Solar Plant Zone</h3>
                    </div>
                  </button>
                )}
              </div>
              <h5>As a Drone Controller, you can Create and Manage Tasks.</h5>
            </>
          )}

          {selectedRole === "da" && (
            <>
              <div className="cards">
                {hasPermission("analyze_data") && (
                  <button className="card-btn">
                    <div className="header">
                      <img src="logo192.png" alt="Zones Dashboard Pic" />
                      <h2>Zones Dashboard</h2>
                    </div>
                    <div className="ability">
                      <h3>Monitor Zone</h3>
                      <h3>Status and Tasks</h3>
                    </div>
                  </button>
                )}
                {hasPermission("analyze_data") && (
                  <button className="card-btn">
                    <div className="header">
                      <img src="logo192.png" alt="Analysis Result Pic" />
                      <h2>Analysis Result</h2>
                    </div>
                    <div className="ability">
                      <h3>Monitor and Update Task</h3>
                    </div>
                  </button>
                )}
                {hasPermission("view_reports") && (
                  <button className="card-btn">
                    <div className="header">
                      <img src="logo192.png" alt="API Dashboard Pic" />
                      <h2>API Dashboard</h2>
                    </div>
                    <div className="ability">
                      <h3>Check Your API Activity</h3>
                    </div>
                  </button>
                )}
              </div>
              <h5>As a Data Analyst, you can get data of each zone, AI Analysis Result, API Used Dashboard</h5>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
