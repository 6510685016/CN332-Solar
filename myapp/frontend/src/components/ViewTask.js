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
        console.log("Fetched task:", res.data);
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
      <p><strong>Task Detail:</strong> {task.taskDetail}</p>
      <p><strong>Submit Date:</strong> {new Date(task.submitDate).toLocaleDateString()}</p>
      <p><strong>Result Date:</strong> {new Date(task.resultDate).toLocaleDateString()}</p>
      <p><strong>Solar Plant ID:</strong> {task.solarPlantID}</p>
      <p><strong>Zone ID:</strong> {task.zoneID}</p>
      <p><strong>Average Efficiency:</strong> {task.avgEfficiency}%</p>

      <button onClick={() => navigate("/taskmanage")}>Back</button>
    </div>
  );

};

export default ViewTask;
