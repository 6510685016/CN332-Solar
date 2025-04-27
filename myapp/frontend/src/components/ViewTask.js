// ViewTask.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ViewTask.css"

const ViewTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/auth/viewtasks/${taskId}`);
        setTask(res.data);
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    fetchTask();
  }, [taskId]);

  if (!task) return <p>Loading...</p>;

  return (
    <div className="task-detail-container">
      <h2>Task Details</h2>
      <p><strong>Name:</strong> {task.taskId}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <button onClick={() => navigate("/taskmanage")}>Back</button>
    </div>
  );
};

export default ViewTask;
