import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SolarPlantManage.css";
import logo from "../logo.svg";

const SolarPlantManage = () => {
  const [solarPlants, setSolarPlants] = useState([]);
  const [profile, setProfile] = useState({ name: "", picture: logo });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants`);
        console.log("Fetched solar plants:", response.data);
        setSolarPlants(response.data);
      } catch (error) {
        console.error("Error fetching solar plants", error);
        setSolarPlants([]); // Set empty array instead of mock data if API fails
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSolarPlants();
  }, [navigate]);

  // Handle Search Input
  const handleSearch = (e) => setSearch(e.target.value);

  // Handle create solar plant button click
  const handleCreatePlant = () => {
    navigate("/createsolarplant");
  };

  const handleViewPlant = (plantId) => {
    navigate(`/solarplantinfo/${plantId}`); // Changed to match SolarPlantInfo component route
  };
  
  const handleEditPlant = (plantId) => {
    navigate(`/solarplantinfo/${plantId}?edit=true`); // Changed to match SolarPlantInfo component route
  };
  
  const handleDeletePlant = async (plantId) => {
    try {
      if (window.confirm("Are you sure you want to delete this solar plant?")) {
        await axios.delete(`${process.env.REACT_APP_BACKEND}/solarplants/${plantId}`);
        // Update the frontend state after successful deletion
        setSolarPlants(solarPlants.filter(plant => plant._id !== plantId));
      }
    } catch (error) {
      console.error("Error deleting solar plant", error);
      alert("Failed to delete solar plant. Please try again.");
    }
  };

  // Filter plants based on search
  const filteredPlants = solarPlants.filter(plant => 
    plant.name && plant.name.toLowerCase().includes(search.toLowerCase())
  );

  // Helper function to format zone names
  const formatZones = (plant) => {
    if (!plant.zones || plant.zones.length === 0) {
      return "No zones";
    }
    return plant.zones.map(zone => zone.name).join(", ");
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
      ) : solarPlants.length === 0 ? (
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
              <td>{plant.name}</td>
              <td>{plant.location}</td>
              <td>{formatZones(plant)}</td>
              <td>{plant.transformer || "-"}</td>
              <td>{plant.inverter || "-"}</td>
              <td>
                <button className="view-button" onClick={() => handleViewPlant(plant._id)}>
                  View
                </button>
                <button className="edit-plant-button" onClick={() => handleEditPlant(plant._id)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeletePlant(plant._id)}>
                  Delete
                </button>
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