import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateZone.css";

const CreateZone = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { solarPlantId, solarPlantName } = state || {};

    const [zoneName, setZoneName] = useState("");
    const [numSolarX, setNumSolarX] = useState("");
    const [numSolarY, setNumSolarY] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const BACKEND_URL = process.env.REACT_APP_BACKEND;

    const handleDone = async () => {
        setErrorMessage("");
        try {
            const response = await axios.post(`${BACKEND_URL}/solarplants/${solarPlantId}/zones`, {
                zoneName,
                numSolarX: parseInt(numSolarX),
                numSolarY: parseInt(numSolarY)
            });

            const zoneId = response.data.zoneId; 
            navigate(`/zone/${zoneId}`)
        } catch (error) {
            console.error("Failed to create zone:", error);
            const message = error.response?.data?.error || "Unknown error";
            setErrorMessage(message);
        }


    };

    return (
        <div className="create-zone-container">
            <h1>Create New Zone in {solarPlantName || "..."}</h1>

            <div className="form-group">
                <label>Zone Name:</label>
                <input
                    type="text"
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Number of Solar in Column:</label>
                <input
                    type="number"
                    value={numSolarX}
                    onChange={(e) => setNumSolarX(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Number of Solar Row:</label>
                <input
                    type="number"
                    value={numSolarY}
                    onChange={(e) => setNumSolarY(e.target.value)}
                />
            </div>

            <button onClick={handleDone}>Done</button>

            {/* ✅ ปุ่มกลับ */}
            <button
                style={{ marginLeft: "1rem" }}
                onClick={() => navigate(-1)}
            >
                ⬅️ Back
            </button>

            {errorMessage && (
                <p style={{ color: "red", marginTop: "0.5rem" }}>
                    {errorMessage}
                </p>
            )}
        </div>

    );
};

export default CreateZone;
