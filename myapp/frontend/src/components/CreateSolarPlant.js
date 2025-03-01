import React from "react";
import { useNavigate } from "react-router-dom";
import "./CreateSolarPlant.css";

const CreateSolarPlant = () => {
    const navigate = useNavigate();

    return (
        <div className="create-solar-container">
            {/* Back Button */}
            <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>

            {/* Profile Section */}
            <div className="profile-section">
                <span className="profile-name">Username1</span>
                <img src="/path/to/profile.png" alt="Profile" className="profile-picture" />
            </div>

            <div className="solar-form-container">
                <h2>Create Solar Plant</h2>

                <div className="form-group">
                    <label>Solar Plant Name</label>
                    <button className="form-button">Name</button>
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <button className="form-button">Location</button>
                </div>

                <div className="form-group">
                    <label>Picture</label>
                    <button className="form-button">Upload</button>
                </div>

                <button className="done-button">Done</button>
            </div>

            {/* Map Section */}
            <div className="map-container">
                <h3>พื้นที่ :</h3>
                <img src="/path/to/map.png" alt="Map" className="map-image" />
            </div>
        </div>
    );
};

export default CreateSolarPlant;
