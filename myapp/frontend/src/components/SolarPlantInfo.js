import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./SolarPlantInfo.css";
import logo from "../logo.svg";
import solarPlantImage from "./picture/createsolarplant.png";

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
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await axios.get(`${process.env.REACT_APP_BACKEND}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          name: userRes.data.username,
          picture: userRes.data.picture || logo,
        });
      } catch {
        navigate("/login");
        return;
      }

      try {
        // ใช้ endpoint เดียวกับ manage แล้ว filter
        const plantsRes = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants`);
        const allPlants = plantsRes.data;
        const selectedPlant = allPlants.find((p) => p._id === plantId);
        if (selectedPlant) {
          setPlantData({
            ...selectedPlant
          });
        } else {
          console.error("Plant not found");
        }
      } catch (err) {
        console.error("Error fetching solar plants:", err);
      }

      try {
        // Fetch the components (transformers and inverters) for the selected plant
        const componentsRes = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants/${plantId}/components`);
        const { transformers, inverters } = componentsRes.data;
        console.log("Fetched components:", transformers, inverters);
        setPlantData((prevData) => ({
          ...prevData,
          transformers: transformers || [],
          inverters: inverters || [],
        }));
      } catch (err) {
        console.error("Error fetching components:", err);
      }
    };

    fetchData();
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
          transformers: plantData.transformers,
          inverters: plantData.inverters,
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

  const handleMaintainComponent = (type, id) => {
    if (!plantData?.name || !id || !type) return;

    const efficiency = window.prompt("กรอกค่าประสิทธิภาพที่ต้องการ (%)");

    if (efficiency === null || isNaN(efficiency) || efficiency < 0 || efficiency > 100) {
      alert("กรุณากรอกค่าที่ถูกต้องระหว่าง 0 - 100");
      return;
    }

    axios.patch(`${process.env.REACT_APP_BACKEND}/solarplants/${plantId}/${type}/maintain/${id}`, {
      efficiency: parseFloat(efficiency),
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      alert("อัปเดตการบำรุงรักษาเรียบร้อย");
      window.location.reload();
    })
    .catch((err) => {
      console.error("Update failed:", err);
      alert("อัปเดตล้มเหลว");
    });
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
                <th>Component Type</th>
                <th>Position</th>
                <th>Efficiency</th>
                <th>Last Maintenance</th>
                <th>Actions</th>
              </tr>
            </thead>
            
            <tbody>
              {(plantData.transformers || []).map((transformer) => (
                      <tr key={transformer._id}>
                        <td>Transformer</td>
                        <td>
                          {transformer.position || "Not specified"}
                        </td>
                        <td>
                          {transformer.efficiency || "Not specified"}
                        </td>
                        <td>
                          {transformer.lastMaintenance || "Not specified"}
                        </td>
                        <td>
                          <button
                            className="edit-button"
                            onClick={() => handleMaintainComponent("transformer", transformer._id)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}

              {(plantData.inverters || []).map((inverter) => (
                      <tr key={inverter._id}>
                        <td>Inverter</td>
                        <td>
                          {inverter.position || "Not specified"}
                        </td>
                        <td>
                          {inverter.efficiency || "Not specified"}
                        </td>
                        <td>
                          {inverter.lastMaintenance || "Not specified"}
                        </td>
                        <td>
                          <button
                            className="edit-button"
                            onClick={() => handleMaintainComponent("inverter", inverter._id)}
                          >
                            Edit
                          </button>
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
                            onClick={() => navigate(`/zone/${zone._id}`)}
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
                <img src={solarPlantImage} alt="Map" className="map-image" />
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
