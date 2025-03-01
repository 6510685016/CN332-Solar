import React from "react";
import "./SolarPlantManage.css";
import { useNavigate } from "react-router-dom";
import solarPlantImage from "./picture/solarplantmanage.png";

const SolarPlantManage = () => {
    const navigate = useNavigate();

    return (
        <div className="solar-plant-manage-container">
            <button className="back-button" onClick={() => {
                localStorage.clear();
                navigate("/");
            }}>⬅ Back</button>

            <div className="profile-section">
                <span className="profile-name">Username1</span>
                <img src="../logo.svg" alt="Profile" className="profile-picture" />
            </div>

            <div className="solar-plant-manage">
                <div className="header">
                    <h2>Solar Plant Manager</h2>
                </div>
                <div className="content">
                    <div className="plant-section">
                        <h3>All Zone of Solar Plant A</h3>
                        <img src={solarPlantImage} alt="Solar Plant" className="plant-image" />
                        <button className="create-zone" onClick={() => navigate("/createzone")}>Create Zone</button>
                    </div>
                    <div className="create-new-plant" onClick={() => navigate("/createsolarplant")}>
                        <h3>Create New Solar Plant</h3>
                        <div className="create-box">+</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolarPlantManage;