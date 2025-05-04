import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SolarPlantManage.css";
import logo from "../logo.svg";

const SolarPlantManage = () => {
  const [plants, setPlants] = useState([]);
  const [profile, setProfile] = useState({ name: "", picture: logo });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

    // Fetch solar plants from database (mock data for now)
    // In a real application, you'd fetch from your API
    setPlants([
      { id: 1, name: "ปูพลังงานแสงอาทิตย์ A001", zone: { admin: "Admin", droneC: "Drone C.", dataA: "Data A" } },
      { id: 2, name: "ปูพลังงานแสงอาทิตย์ A001", zone: { admin: "Admin", droneC: "Drone C.", dataA: "Data A" } },
      { id: 3, name: "ปูพลังงานแสงอาทิตย์ A001", zone: { admin: "Admin", droneC: "Drone C.", dataA: "Data A" } },
      { id: 4, name: "ปูพลังงานแสงอาทิตย์ A001", zone: { admin: "Admin", droneC: "Drone C.", dataA: "Data A" } },
      { id: 5, name: "ปูพลังงานแสงอาทิตย์ A001", zone: { admin: "Admin", droneC: "Drone C.", dataA: "Data A" } }
    ]);
  }, [navigate]);

  // Handle Search Input
  const handleSearch = (e) => setSearch(e.target.value);

  // Handle create solar plant button click
  const handleCreatePlant = () => {
    navigate("/createsolarplant");
  };

  const handleViewPlant = (plantId) => {
    navigate(`/solarplantinfo/${plantId}`);
  };

  const handleEditZone = (plantId) => {
    // Navigate to edit zone page or open a modal
    console.log("Edit zone for plant:", plantId);
  };

  const handleEditPlant = (plantId) => {
    navigate(`/solarplantinfo/${plantId}?edit=true`);
  };

  const handleDeletePlant = (plantId) => {
    // Implement delete functionality
    console.log("Delete plant:", plantId);
    if (window.confirm("Are you sure you want to delete this solar plant?")) {
      // Delete logic here
      setPlants(plants.filter(plant => plant.id !== plantId));
    }
  };

  // Filter plants based on search
  const filteredPlants = plants.filter(plant => 
    plant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="solar-plant-manage-container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅ Back
      </button>

      <div className="profile-section">
        <span className="profile-name">{profile.name}</span>
        <img src={profile.picture} alt="Profile" className="profile-picture" />
      </div>

      <h2 className="solar-plant-manage-title">Solar Plant Manage</h2>

      <div className="search-and-create">
        <input
          type="text"
          placeholder="Username/Role"
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />
        <button className="create-button" onClick={handleCreatePlant}>
          Create Solar Plant
        </button>
      </div>

      <table className="solar-plant-table">
        <thead>
          <tr>
            <th>-</th>
            <th>Name</th>
            <th>Zone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlants.map((plant, index) => (
            <tr key={plant.id}>
              <td>{index + 1}</td>
              <td>{plant.name}</td>
              <td>
                (3) Admin, Drone C., Data A
                <div>
                  <button className="edit-zone-button" onClick={() => handleEditZone(plant.id)}>
                    Edit Zone
                  </button>
                </div>
              </td>
              <td>
                <button className="view-button" onClick={() => handleViewPlant(plant.id)}>
                  View
                </button>
                <button className="edit-plant-button" onClick={() => handleEditPlant(plant.id)}>
                  Edit Plant
                </button>
                <button className="delete-button" onClick={() => handleDeletePlant(plant.id)}>
                  Delete
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