import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ZoneManage.css";
import logo from "../logo.svg"; // your logo file

const ZoneManage = () => {
  const [plants, setPlants] = useState([
    { id: 1, name: "Solar Plant Alpha" },
    { id: 2, name: "Solar Plant Beta" },
    { id: 3, name: "Solar Plant Gamma" },
  ]);
  const [profile, setProfile] = useState({ name: "", picture: logo });

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
            picture: logo, // using your imported logo
          });
        })
        .catch(() => navigate("/login"));
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND}/plants`)
      .then((response) => {
        setPlants(response.data);
      })
      .catch((error) => console.error("Error fetching solar plants:", error));
  }, [navigate]);

  return (
    <div className="zone-container">
      <div className="zone-header">
        <div className="zone-user">
          <img src={profile.picture} alt="logo" className="user-logo" />
          <span>{profile.name}</span>
        </div>
        <button className="logout-button" onClick={() => navigate("/login")}>
          Logout
        </button>
      </div>

      <h1 className="zone-title">Select Solar Plant</h1>

      <div className="plant-list">
        {plants.map((plant) => (
          <div
            key={plant._id}
            className="plant-item"
            onClick={() => navigate(`/zonemanage/${plant._id}`)}
          >
            {plant.name}
            <span className="arrow-icon">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZoneManage;
