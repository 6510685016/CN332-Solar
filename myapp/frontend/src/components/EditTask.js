import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditTask.css";

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/auth/viewtasks/${taskId}`);
        setTaskName(res.data.taskId);
        setStatus(res.data.status);
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND}/auth/edittasks/${taskId}`, {
        taskName,
        status
      });
      alert("Task updated successfully!");
      navigate("/taskmanage");
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  return (
    <div className="edit-task-container">
      <h2 className="edit-task-title">Edit Task</h2>
      <div className="form-group">
        <label>Task Name</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>
      <div className="button-group">
        <button className="save-button" onClick={handleUpdate}>Save</button>
        <button className="cancel-button" onClick={() => navigate("/taskmanage")}>Cancel</button>
      </div>
    </div>
  );
};

export default EditTask;
