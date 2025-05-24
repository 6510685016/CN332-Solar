import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import logo from "../logo.svg";
import "./ZoneDashboard.css";

const ZoneDashboard = () => {
  const { plantId } = useParams(); // this is actually plantId from the route `/zones/:plantId`
  const [zones, setZones] = useState([]);
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
      .then((res) => {
        setProfile({
          name: res.data.username,
          picture: res.data.picture || logo,
        });
      })
      .catch(() => navigate("/login"));

    // Fetch zones for the selected plant
    const fetchZones = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/solarplants/${plantId}/zones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setZones(res.data);
      } catch (err) {
        console.error("Failed to fetch zones:", err);
      }
    };

    fetchZones();
  }, [navigate, plantId]);

  return (
    <div className="zone-container">
      <div className="user-manage-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
  
        <div className="profile-section">
          <span className="profile-name">{profile.name}</span>
          <img src={profile.picture} alt="Profile" className="profile-picture" />
        </div>
  
        <h1 className="user-manage-title">View Result</h1>
      </div>

      <h2 className="zone-title">Select Zone</h2>

      <div className="zone-list">
        {zones.map((zone) => (
          <div
            key={zone._id}
            className="zone-item"
            onClick={() => navigate(`/zones/${zone._id}/task`)}
          >
            {zone.name}
            <span className="arrow-icon">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZoneDashboard;
