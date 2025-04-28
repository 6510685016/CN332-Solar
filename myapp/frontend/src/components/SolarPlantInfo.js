import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./SolarPlantInfo.css";
import logo from "../logo.svg";

const SolarPlantInfo = () => {
  const { plantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = new URLSearchParams(location.search).get("edit") === "true";
  const isNewPlant = !plantId;

  const [profile, setProfile] = useState({ name: "", picture: logo });
  const [plantData, setPlantData] = useState({
    name: "",
    location: "",
    components: [
      { id: 1, type: "transformer", name: "", status: "", lastMaintenance: "" },
      { id: 2, type: "inverter", name: "", status: "", lastMaintenance: "" }
    ],
    zones: [
      { id: 1, name: "Zone AAAAAAAA", actions: ["view", "maintenance"] }
    ]
  });

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

    // If editing an existing plant, fetch its data
    if (plantId && !isNewPlant) {
      // In a real application, you'd fetch from your API
      // For now, we'll set some mock data
      setPlantData({
        name: "Solar Plant A",
        location: "Location A",
        components: [
          { id: 1, type: "transformer", name: "Transformer A", status: "Operational", lastMaintenance: "2025-01-15" },
          { id: 2, type: "inverter", name: "Inverter A", status: "Operational", lastMaintenance: "2025-02-20" }
        ],
        zones: [
          { id: 1, name: "Zone AAAAAAAA", actions: ["view", "maintenance"] }
        ]
      });
    }
  }, [navigate, plantId, isNewPlant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlantData({ ...plantData, [name]: value });
  };

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...plantData.components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    setPlantData({ ...plantData, components: updatedComponents });
  };

  const handleCreateZone = () => {
    // Logic to create a new zone
    console.log("Creating new zone");
  };

  const handleSavePlant = () => {
    // Logic to save plant data
    console.log("Saving plant data:", plantData);
    // After saving, redirect back to the manage page
    navigate("/solarplantmanage");
  };

  return (
    <div className="solar-plant-info-container">
      <button className="back-button" onClick={() => navigate("/solarplantmanage")}>
        ⬅ Back
      </button>

      <div className="profile-section">
        <span className="profile-name">{profile.name}</span>
        <img src={profile.picture} alt="Profile" className="profile-picture" />
      </div>

      <div className="solar-plant-info">
        <h2>{isNewPlant ? "Create Solar Plant" : isEditMode ? "Edit Solar Plant" : "Solar Plant Details"}</h2>

        <div className="plant-form">
          <div className="form-group">
            <label>Plant Name:</label>
            <input
              type="text"
              name="name"
              value={plantData.name}
              onChange={handleInputChange}
              disabled={!isEditMode && !isNewPlant}
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={plantData.location}
              onChange={handleInputChange}
              disabled={!isEditMode && !isNewPlant}
            />
          </div>

          <h3>Component status</h3>
          <table className="component-table">
            <thead>
              <tr>
                <th>-</th>
                <th>type</th>
                <th>name</th>
                <th>Status</th>
                <th>Last Maintenance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plantData.components.map((component, index) => (
                <tr key={component.id}>
                  <td>{index + 1}</td>
                  <td>{component.type}</td>
                  <td>
                    <input
                      type="text"
                      value={component.name}
                      onChange={(e) => handleComponentChange(index, "name", e.target.value)}
                      disabled={!isEditMode && !isNewPlant}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={component.status}
                      onChange={(e) => handleComponentChange(index, "status", e.target.value)}
                      disabled={!isEditMode && !isNewPlant}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={component.lastMaintenance}
                      onChange={(e) => handleComponentChange(index, "lastMaintenance", e.target.value)}
                      disabled={!isEditMode && !isNewPlant}
                    />
                  </td>
                  <td>
                    <button className="maintenance-button">Maintenance</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="zone-section">
            <div className="zone-header">
              <h3>Zone</h3>
              <button className="create-zone-button" onClick={handleCreateZone}>Create zone</button>
            </div>
            
            <div className="zones-container">
              <div className="zone-list">
                <table className="zone-table">
                  <thead>
                    <tr>
                      <th>name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plantData.zones.map((zone) => (
                      <tr key={zone.id}>
                        <td>{zone.name}</td>
                        <td>
                          <button className="view-zone-button">View</button>
                          <button className="maintenance-button">Maintenance</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="zone-map">
                <div className="map-placeholder">
                  {/* Map would go here */}
                  <div className="map-image"></div>
                </div>
              </div>
            </div>
          </div>

          {(isEditMode || isNewPlant) && (
            <div className="form-actions">
              <button className="save-button" onClick={handleSavePlant}>
                {isNewPlant ? "Create" : "Save"}
              </button>
              <button className="cancel-button" onClick={() => navigate("/solarplantmanage")}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarPlantInfo;