import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SolarPlantManage.css";
import logo from "../logo.svg";

const SolarPlantManage = () => {
  const [solarPlants, setSolarPlants] = useState([]);
  const [profile, setProfile] = useState({ name: "", picture: logo });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile
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

    // Fetch solar plants from backend
    const fetchSolarPlants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants`);
        console.log("Fetched solar plants:", response.data);
        setSolarPlants(response.data);
      } catch (error) {
        console.error("Error fetching solar plants", error);
      }
    };

    fetchSolarPlants();
  }, [navigate]);

  const handleCreateZone = (solarPlantId, solarPlantName) => {
    navigate("/createzone", {
      state: {
        solarPlantId: solarPlantId,
        solarPlantName: solarPlantName
      }
    });
  };

  const handleView = (solarPlantId) => {
    navigate(`/viewsolarplant/${solarPlantId}`);
  };

  return (
    <div className="solar-plant-manage-container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>⬅ Back</button>

      <div className="profile-section">
        <span className="profile-name">{profile.name}</span>
        <img src={profile.picture} alt="Profile" className="profile-picture" />
      </div>

      <h2 className="solar-plant-manage-title">Solar Plant Dashboard</h2>

      <button className="create-button" onClick={() => navigate("/createsolarplant")}>
        Create New Solar Plant
      </button>

      <table className="solar-plant-table">
        <thead>
          <tr>
            <th>Solar Plant Name</th>
            <th>Location</th>
            <th>Zones</th>
            <th>Transformer</th>
            <th>Inverter</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {solarPlants.map((plant) => (
            <tr key={plant._id}>
              <td>{plant.name}</td>
              <td>{plant.location}</td>
              <td>
                {plant.zones && plant.zones.length > 0
                  ? plant.zones.map(zone => zone.name).join(", ")
                  : "No zones"}
              </td>
              <td>{plant.transformer}</td>
              <td>{plant.inverter}</td>
              <td>
                <button className="confirm-button" onClick={() => handleView(plant._id)}>View</button>
                <button className="confirm-button" onClick={() => handleCreateZone(plant._id, plant.name)}>
                  Add Zone
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SolarPlantManage;