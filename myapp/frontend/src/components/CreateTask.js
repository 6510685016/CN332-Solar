import React, { useEffect, useState } from "react";
import "./CreateTask.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTask = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [solarPlants, setSolarPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchSolarPlants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/auth/create`);
        setSolarPlants(response.data);
      } catch (error) {
        console.error("Error fetching solar plants", error);
      }
    };
    fetchSolarPlants();
  }, []);

  useEffect(() => {
    const plant = solarPlants.find((sp) => sp._id === selectedPlantId);
    setZones(plant?.zones || []);
  }, [selectedPlantId, solarPlants]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("taskName", taskName);
    formData.append("solarPlantId", selectedPlantId);
    formData.append("zone", selectedZone);
    formData.append("image", image);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/auth/tasks`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
        <label>Task Name</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
        />
      </div>

      <div className="form-group">
        <label>Select Solar Plant</label>
        <select
          value={selectedPlantId}
          onChange={(e) => setSelectedPlantId(e.target.value)}
        >
          <option value="">-- Select Solar Plant --</option>
          {solarPlants.map((plant) => (
            <option key={plant._id} value={plant._id}>
              {plant.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Zone</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
        >
          <option value="">-- Select Zone --</option>
          {zones.map((zone, idx) => (
            <option key={idx} value={zone.borderPosition}>
              Zone {idx + 1}: {zone.borderPosition}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Upload Image (mockup)</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </div>

      <div className="button-group">
        <button className="done-button" onClick={handleSubmit}>Done</button>
        <button className="cancel-button" onClick={() => navigate("/taskmanage")}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateTask;
