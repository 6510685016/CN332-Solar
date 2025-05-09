import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUsername(response.data.username);
          setRoles(response.data.roles);
          setPermissions(response.data.permissions);
        })
        .catch((error) => {
          console.error("Error:", error);
          navigate("/login");
        });
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let userName = username;
  if (userName.length > 10) {
    userName = userName.substring(0, 10) + "...";
  }

  const hasPermission = (permission) => permissions.includes(permission);

  return (
    <div className="body">
      <div className="user-bar">
        <div className="username-info">
          <img src="logo192.png" className="profile-img" alt="profile" />
          <h3>{userName}</h3>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="hub-btn"
        >
          Logout
        </button>
      </div>

      <div className="user-info">
        <div className="hello-user">
          <h1>Hello, {userName}</h1>
          <h1>System Time: {currentTime} last update....</h1>
        </div>
        <div className="user-activity">
          <h3>last act is ....</h3>
        </div>
      </div>

      <hr />

      <div className="manage-panel">
        <h1>Management Panel</h1>

        <div className="no-role">
          {roles.length === 0 && (
            <h5>
              No role has been assigned to you.{" "}
              <a href="https://www.example.com">Please contact the admin here.</a>
            </h5>
          )}
        </div>

        <div className="cards">
          {(roles.includes("Admin") || roles.includes("SuperAdmin")) && (
            <>
              {hasPermission("userManage") && (
                <button className="card-btn" onClick={() => navigate("/usermanage")}>
                  <div className="card-role-label">Admin</div>
                  <div className="header">
                    <span role="img" aria-label="user-management">👥</span> {/* อิโมจิสำหรับการจัดการผู้ใช้ */}
                    <h2>User Manage Dashboard</h2>
                  </div>
                  <div className="ability">
                    <h3>Assign Roles</h3>
                    <h3>Manage Users</h3>
                  </div>
                </button>
              )}
              {hasPermission("solarPlantManage") && (
                <button className="card-btn" onClick={() => navigate("/solarplantmanage")}>
                  <div className="card-role-label">Admin</div>
                  <div className="header">
                    <span role="img" aria-label="solar-plant">🌞</span> {/* อิโมจิสำหรับ Solar Plant */}
                    <h2>Solar Plant Manage Dashboard</h2>
                  </div>
                  <div className="ability">
                    <h3>Create, Modify, Remove Solar Plant.</h3>
                  </div>
                </button>
              )}
            </>
          )}

          {(roles.includes("DroneController") || roles.includes("SuperAdmin")) && hasPermission("taskManage") && (
            <>
              <button className="card-btn" onClick={() => navigate("/taskmanage")}>
                <div className="card-role-label">Drone Controller</div>
                <div className="header">
                  <span role="img" aria-label="drone">🚁</span> {/* อิโมจิสำหรับ Drone */}
                  <h2>Task Manage Dashboard</h2>
                </div>
                <div className="ability">
                  <h3>Monitor Zone</h3>
                  <h3>Status and Tasks</h3>
                </div>
              </button>

              <button className="card-btn" onClick={() => navigate("/createtask")}>
                <div className="card-role-label">Drone Controller</div>
                <div className="header">
                  <span role="img" aria-label="create-task">📝</span> {/* อิโมจิสำหรับ Create Task */}
                  <h2>Create New Task</h2>
                </div>
                <div className="ability">
                  <h3>Starting Analysis for Solar Plant Zone</h3>
                </div>
              </button>
            </>
          )}

          {(roles.includes("Analyst") || roles.includes("SuperAdmin")) && hasPermission("fetchData") && (
            <button className="card-btn" onClick={() => navigate("/zones")}>
              <div className="card-role-label">Data Analyst</div>
              <div className="header">
                <span role="img" aria-label="zones">🌍</span> {/* อิโมจิสำหรับ Zones */}
                <h2>Zones Dashboard</h2>
              </div>
              <div className="ability">
                <h3>Monitor Zone</h3>
                <h3>Status and Tasks</h3>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
