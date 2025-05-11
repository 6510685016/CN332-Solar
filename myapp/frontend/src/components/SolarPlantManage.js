import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./SolarPlantManage.css";
import logo from "../logo.svg";

const SolarPlantManage = () => {
  const [solarPlants, setSolarPlants] = useState([]);
  const [profile, setProfile] = useState({ name: "", picture: logo });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchSolarPlants = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants`);
      console.log("Fetched solar plants:", response.data);
      setSolarPlants(response.data);
    } catch (error) {
      console.error("Error fetching solar plants", error);
      setSolarPlants([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      .then((response) => {
        setProfile({
          name: response.data.username,
          picture: response.data.picture || logo,
        });
      })
      .catch(() => navigate("/login"));

    fetchSolarPlants();

    if (location.state?.refreshData) {
      fetchSolarPlants();
    }
  }, [navigate, location]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleCreatePlant = () => navigate("/createsolarplant");
  const handleViewPlant = (id) => navigate(`/solarplantinfo/${id}`);
  const handleEditPlant = (id) => navigate(`/solarplantinfo/${id}?edit=true`);

  const handleDeletePlant = async (id) => {
    if (window.confirm("Are you sure you want to delete this solar plant?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND}/solarplants/${id}`);
        setSolarPlants(solarPlants.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting solar plant", error);
        alert("Failed to delete solar plant.");
      }
    }
  };

  const filteredPlants = solarPlants.filter((plant) =>
    plant.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatZones = (plant) => {
    if (!Array.isArray(plant.zones) || plant.zones.length === 0) return "No zones";
    return plant.zones.map((z) => z.name || "Unnamed").join(", ");
  };

  const formatTransformers = (plant) => {
    if (plant.transformer) return plant.transformer;
    if (!Array.isArray(plant.zones)) return "-";
    const values = plant.zones.map((z) => z.transformer).filter(Boolean);
    return values.length ? values.join(", ") : "-";
  };

  const formatInverters = (plant) => {
    if (plant.inverter) return plant.inverter;
    if (!Array.isArray(plant.zones)) return "-";
    const values = plant.zones.map((z) => z.inverter).filter(Boolean);
    return values.length ? values.join(", ") : "-";
  };

  return (
    <div className="solar-plant-manage-container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅ Back
      </button>

      <div className="profile-section">
        <span className="profile-name">{profile.name}</span>
        <img src={profile.picture} alt="Profile" className="profile-picture" />
      </div>

      <h2 className="solar-plant-manage-title">Solar Plant Dashboard</h2>

      <div className="search-and-create">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />
        <button className="create-button" onClick={handleCreatePlant}>
          Create New Solar Plant
        </button>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading solar plants...</div>
      ) : filteredPlants.length === 0 ? (
        <div className="no-plants-message">No solar plants found.</div>
      ) : (
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
            {filteredPlants.map((plant) => (
              <tr key={plant._id}>
                <td>{plant.name || "-"}</td>
                <td>{plant.location || "-"}</td>
                <td>{formatZones(plant)}</td>
                <td>{formatTransformers(plant)}</td>
                <td>{formatInverters(plant)}</td>
                <td>
                  <button className="view-button" onClick={() => handleViewPlant(plant._id)}>View</button>
                  <button className="edit-plant-button" onClick={() => handleEditPlant(plant._id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeletePlant(plant._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SolarPlantManage;
