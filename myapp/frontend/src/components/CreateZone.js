import React from "react";
import { useNavigate } from "react-router-dom";
import "./CreateZone.css";

const CreateZone = () => {
    const navigate = useNavigate();

    return (
        <div className="create-zone-container">
            {/* Back Button */}
            <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>

            {/* Profile Section */}
            <div className="profile-section">
                <span className="profile-name">Username1</span>
                <img src="/path/to/profile.png" alt="Profile" className="profile-picture" />
            </div>

            <div className="zone-form-container">
                <h2>Create Zone in Solar Plant A</h2>

                <div className="form-group">
                    <label>Zone ID</label>
                    <button className="form-button">Name</button>
                </div>

                <div className="form-group">
                    <label>Area</label>
                    <button className="form-button">Area</button>
                </div>

                <div className="form-group">
                    <label>Transformer</label>
                    <button className="form-button">Name</button>
                </div>

                <div className="form-group">
                    <label>Inverter</label>
                    <button className="form-button">Name</button>
                </div>

                <button className="done-button">Done</button>
            </div>

            {/* Image Section */}
            <div className="image-container">
                <h3>Solar Plant A</h3>
                <img src="/path/to/solarplant.png" alt="Solar Plant" className="solar-image" />
            </div>
        </div>
    );
};

export default CreateZone;
