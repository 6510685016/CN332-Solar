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

  const [profile, setProfile] = useState({ name: "", picture: logo });
  const [plantData, setPlantData] = useState({
    name: "",
    location: "",
    zones: [],
    transformer: 0,
    inverter: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile({
          name: res.data.username,
          picture: res.data.picture || logo,
        });
      })
      .catch(() => navigate("/login"));

    // ใช้ endpoint เดียวกับ manage แล้ว filter
    axios.get(`${process.env.REACT_APP_BACKEND}/solarplants`)
      .then((res) => {
        const allPlants = res.data;
        const selectedPlant = allPlants.find((p) => p._id === plantId);
        if (selectedPlant) {
          setPlantData({
            ...selectedPlant,
            transformer: selectedPlant.transformer || 0,
            inverter: selectedPlant.inverter || 0,
          });
        } else {
          console.error("Plant not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching solar plants:", err);
      });
  }, [navigate, plantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlantData({ ...plantData, [name]: value });
  };

  const handleComponentChange = (type, value) => {
    setPlantData({ ...plantData, [type]: Number(value) });
  };

  const handleCreateZone = () => {
    navigate("/createzone", {
      state: {
        solarPlantId: plantId,
        solarPlantName: plantData.name,
      },
    });
  };

  const handleSavePlant = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.patch(
      `${process.env.REACT_APP_BACKEND}/solarplants/${plantId}`,
      {
        name: plantData.name,
        location: plantData.location,
        transformer: plantData.transformer,
        inverter: plantData.inverter,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    navigate("/solarplantmanage");
  } catch (error) {
    console.error("Failed to save plant:", error);
    alert("Failed to save changes.");
  }
};


  return (
    <div className="solar-plant-info-container">
      <button className="back-button" onClick={() => navigate("/solarplantmanage")}>⬅ Back</button>

      <div className="profile-section">
        <span className="profile-name">{profile.name}</span>
        <img src={profile.picture} alt="Profile" className="profile-picture" />
      </div>

      <div className="solar-plant-info">
        <h2>{isEditMode ? "Edit Solar Plant" : "Solar Plant Details"}</h2>

        <div className="plant-form">
          <div className="form-group">
            <label>Plant Name:</label>
            <input
              type="text"
              name="name"
              value={plantData.name}
              onChange={handleInputChange}
              disabled={!isEditMode}
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={plantData.location}
              onChange={handleInputChange}
              disabled={!isEditMode}
            />
          </div>

          <h3>Component Status</h3>
          <table className="component-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Transformer</td>
                <td>
                  <input
                    type="number"
                    value={plantData.transformer}
                    onChange={(e) => handleComponentChange("transformer", e.target.value)}
                    disabled={!isEditMode}
                    min={0}
                  />
                </td>
              </tr>
              <tr>
                <td>Inverter</td>
                <td>
                  <input
                    type="number"
                    value={plantData.inverter}
                    onChange={(e) => handleComponentChange("inverter", e.target.value)}
                    disabled={!isEditMode}
                    min={0}
                  />
                </td>
              </tr>
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
                      <th>Zone Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(plantData.zones || []).map((zone) => (
                      <tr key={zone._id}>
                        <td>{zone.zoneObj?.zoneName || "Unnamed"}</td>
                        <td>
                          <button
                            className="view-zone-button"
                            onClick={() => navigate(`/zones/${zone._id}/task`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="zone-map">
                <div className="map-placeholder">
                  <div className="map-image"></div>
                </div>
              </div>
            </div>
          </div>

          {isEditMode && (
            <div className="form-actions">
              <button className="save-button" onClick={handleSavePlant}>Save</button>
              <button className="cancel-button" onClick={() => navigate("/solarplantmanage")}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarPlantInfo;
