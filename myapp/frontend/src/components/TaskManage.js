import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TaskManage.css";
import logo from "../logo.svg";

const TaskManage = () => {
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState({ name: "", picture: logo });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // ดึงโปรไฟล์ผู้ใช้
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

    // ดึง tasks จาก backend (เปลี่ยนเป็น /tasks)
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/tasks`);
        console.log("Fetched tasks:", response.data);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleStart = async (taskId) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_BACKEND}/tasks/starttasks/${taskId}`, {
        status: "Waiting",
      });

      // อัปเดต task ที่เพิ่งถูกเปลี่ยนใน frontend
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: res.data.status } : task
        )
      );
    } catch (error) {
      console.error("Error starting task", error);
    }
  };


  const handleEdit = (taskId) => {
    navigate(`/edittask/${taskId}`);
  };

  const handleView = (taskId) => {
    navigate(`/viewtask/${taskId}`);
  };

  return (
    <div className="task-manage-container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>⬅ Back</button>

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
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.taskId || task._id}</td>
              <td>{task.solarPlantName}</td>
              <td>{task.zone}</td>
              <td>{task.status}</td>
              <td>{new Date(task.dueDate).toLocaleDateString()}</td>
              <td>
                {(task.status === "Created" || task.status === "Error") && (
                  <>
                    <button className="confirm-button" onClick={() => handleStart(task._id)}>Start</button>
                    <button className="confirm-button" onClick={() => handleEdit(task._id)}>Edit</button>
                  </>
                )}
                {(task.status === "Ok" || task.status === "Waiting") && (
                  <button className="confirm-button" onClick={() => handleView(task._id)}>View</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManage;
