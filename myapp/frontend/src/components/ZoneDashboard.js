import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../logo.svg";
import "./ZoneDashboard.css";

const ZoneDashboard = () => {
  const [plants, setPlants] = useState([]);
  const [profile, setProfile] = useState({ name: "", picture: logo });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Set mock profile data
    setProfile({
      name: "John Doe",
      picture: logo,
    });

    // Set mock solar plant data
    const mockPlants = [
      {
        _id: "p1",
        name: "Solar Plant Alpha",
        detail: "High-efficiency panels in desert zone",
        updatedAt: "2025-02-18T09:00:00Z",
      },
      {
        _id: "p2",
        name: "Solar Plant Beta",
        detail: "Floating solar on reservoir",
        updatedAt: "2025-02-18T10:30:00Z",
      },
      {
        _id: "p3",
        name: "Gamma Power Field",
        detail: "Mountain-based PV tracking array",
        updatedAt: "2025-02-18T11:15:00Z",
      },
      {
        _id: "p4",
        name: "Delta Solar Hub",
        detail: "Urban rooftop installation",
        updatedAt: "2025-02-18T12:45:00Z",
      },
      {
        _id: "p5",
        name: "Omega Solar Farm",
        detail: "Hybrid solar-wind generation",
        updatedAt: "2025-02-18T14:00:00Z",
      },
    ];

    setPlants(mockPlants);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="task-manage-container">
      <div className="profile-section">
        <span className="profile-name">{profile.name}</span>
        <img src={profile.picture} alt="Profile" className="profile-picture" />
        <button className="confirm-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2 className="task-manage-title">Zone Dashboard</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by name/detail/zone"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="task-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>Detail</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlants.map((plant) => (
            <tr key={plant._id}>
              <td><strong>{plant.name}</strong></td>
              <td>{plant.detail}</td>
              <td>{new Date(plant.updatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZoneDashboard;
