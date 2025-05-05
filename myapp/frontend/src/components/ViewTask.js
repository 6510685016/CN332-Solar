// ViewTask.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ViewTask.css"
import graph from "./picture/graph_mock-up.png";

const ViewTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/tasks/viewtasks/${taskId}`);
        console.log("Fetched task:", res.data);
        setTask(res.data);
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    fetchTask();
  }, [taskId]);

  if (!task) return <p>Loading...</p>;

  const downloadTaskCSV = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/tasks/export/csv/${taskId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `task_${taskId}_solarcell.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading task CSV:", error);
    }
  };



  return (
    <div className="task-detail-container">
      <h2>Task Details</h2>
      <p><strong>Task Detail:</strong> {task.taskDetail}</p>
      <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
      <p><strong>Solar Plant:</strong> {task.solarPlantID?.name || "N/A"}</p>
      <p><strong>Zone:</strong> {task.zoneID?.zoneObj?.zoneName || "N/A"}</p>
      <p><strong>Average Efficiency:</strong> {task.avgEfficiency}%</p>
      <img src={graph} alt="Task Graph" className="task-graph" />
      <button onClick={downloadTaskCSV}>Download CSV</button>
      <button onClick={() => navigate("/taskmanage")}>Back</button>
    </div>
  );

};

export default ViewTask;