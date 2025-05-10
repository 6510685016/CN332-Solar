// ViewTask.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ViewTask.css"
import graph from "./picture/graph_mock-up.png";
import ZoneGrid from "./ZoneGrid.js";

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
      <h2 className="title">📋 Task Details</h2>

      <div className="task-info">
        <div className="task-text">
          <p><span>📝 Task Name:</span> {task.taskName}</p>
          <p><span>📄 Detail:</span> {task.taskDetail}</p>
          <p><span>📅 Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}</p>
          <p><span>🌞 Solar Plant:</span> {task.solarPlantID?.name || "N/A"}</p>
          <p><span>📍 Zone:</span> {task?.zoneID?.zoneObj?.zoneName}</p>
        </div>

        <div className="task-image">
          <img src={graph} alt="Task Graph" className="task-graph" />
        </div>
      </div>

      <div className="button-group">
        <button className="btn download-btn">⬇ Download CSV</button>
        <button className="btn back-btn" onClick={() => navigate("/taskmanage")}>⬅ Back</button>
      </div>

      <div className="zoneGrid">
        <ZoneGrid
          width={task?.zoneID?.zoneObj?.numSolarX || 10}
          height={task?.zoneID?.zoneObj?.numSolarY || 10}
          zoneData={task?.zoneID}
          containerHeight={400}
        />
      </div>
    </div>
  );

};

export default ViewTask;