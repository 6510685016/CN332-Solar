import React, { useEffect, useState } from "react";
import "./CreateTask.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTask = () => {
  const navigate = useNavigate();

  // state สำหรับ field ต่าง ๆ
  const [taskDetail, setTaskDetail] = useState("");
  const [submitDate, setSubmitDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // state สำหรับ dropdown
  const [solarPlants, setSolarPlants] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedSolarPlantID, setSelectedSolarPlantID] = useState("");
  const [selectedZoneID, setSelectedZoneID] = useState("");

  // โหลด solar plants ตอน mount
  useEffect(() => {
    const fetchSolarPlants = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND}/solarplants`;
        const res = await axios.get(url);
        setSolarPlants(res.data);
      } catch (err) {
        console.error("Failed to load solar plants", err);
      }
    };
    fetchSolarPlants();
  }, []);

  // เมื่อเลือก solar plant → โหลด zones
  useEffect(() => {
    const fetchZones = async () => {
      if (!selectedSolarPlantID) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants/${selectedSolarPlantID}/zones`);
        setZones(res.data);
      } catch (err) {
        console.error("Failed to load zones", err);
      }
    };
    fetchZones();
  }, [selectedSolarPlantID]);

  // สร้าง Task
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/tasks`, {
        taskDetail,
        submitDate,
        dueDate,
        solarPlantID: selectedSolarPlantID,
        zoneID: selectedZoneID,
        avgEfficiency: null
      });
      console.log("Created task:", response.data);
      alert("Task created successfully!");
      navigate("/taskmanage");
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
        <label>Task Detail</label>
        <input type="text" value={taskDetail} onChange={(e) => setTaskDetail(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Submit Date</label>
        <input type="date" value={submitDate} onChange={(e) => setSubmitDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Solar Plant</label>
        <select value={selectedSolarPlantID} onChange={(e) => setSelectedSolarPlantID(e.target.value)}>
          <option value="">-- Select Solar Plant --</option>
          {solarPlants.map((plant) => (
            <option key={plant._id} value={plant._id}>{plant.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Zone</label>
        <select value={selectedZoneID} onChange={(e) => setSelectedZoneID(e.target.value)} disabled={!zones.length}>
          <option value="">-- Select Zone --</option>
          {zones.map((zone) => (
            <option key={zone._id} value={zone._id}>{zone.name}</option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button className="done-button" onClick={handleSubmit}>Done</button>
        <button className="cancel-button" onClick={() => navigate("/taskmanage")}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateTask;
