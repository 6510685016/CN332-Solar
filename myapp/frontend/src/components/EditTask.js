import React, { useEffect, useState } from "react";
import "./EditTask.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [taskDetail, setTaskDetail] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [solarPlants, setSolarPlants] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedSolarPlantID, setSelectedSolarPlantID] = useState("");
  const [selectedZoneID, setSelectedZoneID] = useState("");

  // Load Solar Plants
  useEffect(() => {
    const fetchSolarPlants = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants`);
      setSolarPlants(res.data);
    };
    fetchSolarPlants();
  }, []);

  // Load Task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/tasks/viewtasks/${taskId}`);
        setTaskName(res.data.taskName);
        setTaskDetail(res.data.taskDetail);
        setDueDate(res.data.dueDate?.split("T")[0]);
        setSelectedSolarPlantID(res.data.solarPlantID?._id || "");
        setSelectedZoneID(res.data.zoneID?._id || "");
      } catch (err) {
        console.error("Error loading task", err);
      }
    };
    fetchTask();
  }, [taskId]);

  // Load zones when solar plant changes
  useEffect(() => {
    const fetchZones = async () => {
      if (!selectedSolarPlantID) return;
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/solarplants/${selectedSolarPlantID}/zones`
        );
        setZones(res.data);
      } catch (err) {
        console.error("Failed to load zones", err);
      }
    };
    fetchZones();
  }, [selectedSolarPlantID]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND}/tasks/edittasks/${taskId}`, {
        taskName,
        taskDetail,
        dueDate,
        solarPlantID: selectedSolarPlantID,
        zoneID: selectedZoneID,
      });
      alert("Task updated successfully!");
      navigate("/taskmanage");
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  return (
    <div className="edit-task-container">
      <h2>Edit Task</h2>

      <div className="form-group">
        <label>Task Name</label>
        <input value={taskName} onChange={(e) => setTaskName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Task Detail</label>
        <input value={taskDetail} onChange={(e) => setTaskDetail(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Solar Plant</label>
        <select
          value={selectedSolarPlantID}
          onChange={(e) => setSelectedSolarPlantID(e.target.value)}
        >
          <option value="">-- Select --</option>
          {solarPlants.map((sp) => (
            <option key={sp._id} value={sp._id}>{sp.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Zone</label>
        <select
          value={selectedZoneID}
          onChange={(e) => setSelectedZoneID(e.target.value)}
          disabled={!zones.length}
        >
          <option value="">-- Select --</option>
          {zones.map((z) => (
            <option key={z._id} value={z._id}>{z.name}</option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button className="save-button" onClick={handleUpdate}>Save</button>
        <button className="cancel-button" onClick={() => navigate("/taskmanage")}>Cancel</button>
      </div>
    </div>
  );
};

export default EditTask;
