import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./TaskDashboard.css";
import logo from "../logo.svg";

const TaskDashboard = () => {
  const { zoneId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [zName, setZoneName] = useState("");
  const [profile, setProfile] = useState({ name: "", picture: logo });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile
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

    // Fetch zone info to get zone name
    const fetchZoneName = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/zones/get/${zoneId}`
        );
        setZoneName(res.data.zoneObj.zoneName);
      } catch (err) {
        console.error("Failed to fetch zone name:", err);
        setZoneName("Unknown Zone");
      }
    };

    // Fetch tasks for this zone
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/tasks/zones/${zoneId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sortedTasks = res.data.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setTasks(sortedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchZoneName();
    fetchTasks();
  }, [navigate, zoneId]);

  const handleView = (taskId) => {
    navigate(`/viewtask/${taskId}`);
  };

  return (
    <div className="task-dashboard-container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅ Back
      </button>

      <div className="profile-section">
        <span className="profile-name">{profile.name}</span>
        <img src={profile.picture} alt="Profile" className="profile-picture" />
      </div>

      <h2 className="task-manage-title">
        Task Manage Dashboard for Zone: {zName}
      </h2>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>SolarPlant</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.taskName}</td>
              <td>{task.solarPlantName}</td>
              <td>{task.status}</td>
              <td>{new Date(task.dueDate).toLocaleDateString()}</td>
              <td>
                <button
                  className="confirm-button"
                  onClick={() => handleView(task._id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskDashboard;
