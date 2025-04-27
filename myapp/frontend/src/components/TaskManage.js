import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TaskManage.css";
import logo from "../logo.svg";

const TaskManage = () => {
  const [tasks, setTasks] = useState([]); // เพิ่ม state สำหรับ task
  const [profile, setProfile] = useState({ name: "", picture: logo });
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

    // ดึงข้อมูล tasks จาก backend
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/auth/tasks`
        );
        setTasks(response.data); // เก็บข้อมูล tasks ที่ดึงมาได้
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };

    fetchTasks(); // เรียกฟังก์ชันนี้เพื่อดึงข้อมูล tasks
  }, [navigate]);

  const handleStart = async (taskId) => {
    try {
      // ส่ง request เพื่อเปลี่ยนสถานะ task เป็น 'waiting'
      await axios.put(`${process.env.REACT_APP_BACKEND}/auth/starttasks/${taskId}`, {
        status: "Waiting",
      });
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: "Waiting" } : task
        )
      );
    } catch (error) {
      console.error("Error starting task", error);
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleView = (taskId) => {
    navigate(`/view-task/${taskId}`);
  };

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

      {/* ตารางแสดงข้อมูล task */}
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
          {/* แสดงข้อมูล task ที่ดึงมาจาก backend */}
          {tasks.map((task) => (
            <tr key={task.taskId}>
              {" "}
              {/* taskId เป็น unique identifier */}
              <td>{task.taskId}</td> {/* หรือชื่อที่ต้องการแสดง */}
              <td>{task.solarPlantName}</td>{" "}
              {/* ใช้ชื่อ Solar Plant ของ task */}
              <td>{task.zone}</td> {/* ใช้ zone ของ task */}
              <td>{task.status}</td> {/* สถานะของ task */}
              <td>{task.createdAt}</td> {/* เวลาที่สร้าง task */}
              <td>
                {task.status === "Created" || task.status === "Error"?(
                  <>
                    <button class = "confirm-button" onClick={() => handleStart(task._id)}>Start</button>
                    <button class = "confirm-button" onClick={() => navigate(`/edittask/${task._id}`)}>
                      Edit
                    </button>
                  </>
                ) : task.status === "Ok" || task.status === "Waiting" ? (
                  <button class = "confirm-button" onClick={() => navigate(`/viewtask/${task._id}`)}>
                    View
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManage;
