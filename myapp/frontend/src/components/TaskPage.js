import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TaskPage.css";
import ZoneGrid from "./ZoneGrid.js";
import logo from "../logo.svg";

const TaskPage = () => {
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
              picture: response.data.picture || logo,
            });
          })
          .catch(() => navigate("/login"));
      }
  
      // TODO: fetch ZoneData

    }, [navigate]);
  
    return (
      <div className="container">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅ Back
        </button>

        <div className="profile-section">
            <span className="profile-name">{profile.name}</span>
            <img src={profile.picture} alt="Profile" className="profile-picture" />
        </div>

        <div className="main-content">
            <div className="top-section">
                <div className="zone-name">
                    <h1>Zone XXX</h1>
                </div>
        
                <div className="zone-detail">
                    <h3>มี 100 แผงนา : อะไรสักอย่าง</h3>
                    <p>เขียว : xxx</p>
                    <p>เหลือง : xxx</p>
                    <p>แดง : xxx</p>
                </div>
            </div>

            <ZoneGrid width={20} height={10} gridData={[]} containerHeight={350} />
        </div>
      </div>
    );
  };
  
  export default TaskPage;
  
  