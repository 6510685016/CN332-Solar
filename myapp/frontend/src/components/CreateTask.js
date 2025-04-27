import React, { useState } from "react";
import "./CreateTask.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTask = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState(""); // กรอกชื่อ task

  // ฟังก์ชันในการส่งข้อมูล
  const handleSubmit = async () => {
    // ส่งชื่อ task ไปเป็น id
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/auth/tasks`, {
        taskId: taskName, // ส่งชื่อที่กรอกมาเป็น task id
      });
      alert("Task created successfully!");
      navigate("/taskmanage"); // เปลี่ยนไปที่หน้า TaskManage
    } catch (error) {
      alert("Error creating task");
      console.error(error);
    }
  };

  return (
    <div className="create-task-container">
      <button className="back-button" onClick={() => navigate("/taskmanage")}>⬅ Back</button>

      <h2>Create Task</h2>

      <div className="form-group">
        <label>Task Name</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
        />
      </div>

      <div className="button-group">
        <button className="done-button" onClick={handleSubmit}>Done</button>
        <button className="cancel-button" onClick={() => navigate("/taskmanage")}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateTask;
