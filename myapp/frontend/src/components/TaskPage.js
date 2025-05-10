import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./TaskPage.css";
import ZoneGrid from "./ZoneGrid.js";
import logo from "../logo.svg";

const TaskPage = () => {
    const [profile, setProfile] = useState({ name: "", picture: logo });
    const { zoneId } = useParams();
    const [zoneData, setZone] = useState(null);
    const [classGroup, setGroup] = useState(null);
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

      const groupPanelsByEfficiency = async (panels) => {
        const groups = {
          high: 0,   // 100–90
          medium: 0, // 89–70
          low: 0     // 69–0
        };
        panels.forEach(panel => {
          const eff = panel.efficiency;
          if (eff >= 90) {
            groups.high++;
          } else if (eff >= 70) {
            groups.medium++;
          } else {
            groups.low++;
          }
        });
        setGroup(groups);
      }
      
      const fetchZone = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND}/zones/get/${zoneId}`);
          console.log("Fetched task:", response.data);
          setZone(response.data);
          groupPanelsByEfficiency(response.data.zoneObj.solarCellPanel);
        } catch (err) {
          console.error("Error fetching task:", err);
        }
      };

      fetchZone();
      console.log(`Test: ${classGroup}`);
    }, [navigate, zoneId]);

    const handleUpdate = async (updatedData) => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND}/zones/update/${zoneId}`,
          {
            zoneId: zoneId,
            solarCellPanel: updatedData
          }
        );

      } catch (error) {
        console.error("Error Update Zone:", error);
      }
    };

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
                    <h1>Zone {zoneData?.zoneObj?.zoneName}</h1>
                </div>
        
                <div className="zone-detail">
                    <h3>Total {zoneData?.zoneObj?.solarCellPanel?.length} Cells</h3>
                    <p>เขียว : {classGroup?.high}</p>
                    <p>เหลือง : {classGroup?.medium}</p>
                    <p>แดง : {classGroup?.low}</p>
                </div>
            </div>

            <ZoneGrid
              width={zoneData?.zoneObj?.numSolarX || 10}
              height={zoneData?.zoneObj?.numSolarY || 10}
              zoneData={zoneData}
              containerHeight={350}
              editable
              onUpdateSolarPanels={(updatedData) => {
                handleUpdate(updatedData);
              }}
            />
        </div>
      </div>
    );
  };
  
  export default TaskPage;
  
  