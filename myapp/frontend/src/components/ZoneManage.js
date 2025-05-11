import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ZoneManage.css";
import logo from "../logo.svg";

const ZoneManage = () => {
  const [plants, setPlants] = useState([]);
  const [profile, setProfile] = useState({ name: "", picture: logo });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // ดึงโปรไฟล์ผู้ใช้
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

    // ดึง tasks จาก backend (เปลี่ยนเป็น /tasks)
    const fetchPlants = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlants(res.data); // assumes response is an array of solar plant objects
      } catch (err) {
        console.error("Failed to fetch solar plants:", err);
      }
    };
  
    fetchPlants();
  }, [navigate]);

  return (
    <div className="zone-container">
      <div className="user-manage-container">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ⬅ Back
        </button>
  
        <div className="profile-section">
          <span className="profile-name">{profile.name}</span>
          <img src={profile.picture} alt="Profile" className="profile-picture" />
        </div>
  
        <h2 className="user-manage-title">Zone Manage Dashboard</h2>
      </div>

      <h1 className="zone-title">Select Solar Plant</h1>

      <div className="plant-list">
        {plants.map((plant) => (
          <div
            key={plant._id}
            className="plant-item"
            onClick={() => navigate(`/zones/${plant._id}`)}
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
