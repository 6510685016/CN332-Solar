import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TaskManage.css";
import logo from "../logo.svg";

const TaskManage = () => {
    const [users, setUsers] = useState([]);
    const [profile, setProfile] = useState({ name: "", picture: logo });
    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
  
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
            setProfile({
              name: response.data.username,
              picture: response.data.picture || logo,
            });

          })
          .catch(() => navigate("/login"));
      }

    }, [navigate]);
  
    return (
      <div className="task-manage-container">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ⬅ Back
        </button>
        <div className="profile-section">
          <span className="profile-name">{profile.name}</span>
          <img src={profile.picture} alt="Profile" className="profile-picture" />
        </div>
  
        <h2 className="task-manage-title">Task Manage Dashboard</h2>
        
        <button className="create-button" onClick={() => navigate("/createtask")}>
          Create New Task
        </button>

  
        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>SolarPlant</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              <td>Testing</td>
              <td>SolarPlant A</td>
              <td>1 , 2</td>
              <td>OK</td>
              <td>4/26/2025</td>
              <td><button class = "confirm-button">view</button></td>
          </tbody>
        </table>
      </div>
      
    );
  };
  
  export default TaskManage;
  
  