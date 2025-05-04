import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateSolarPlant.css";
import solarPlantImage from "./picture/createsolarplant.png";

const CreateSolarPlant = () => {
    const navigate = useNavigate();
    const [solarPlantName, setSolarPlantName] = useState("");
    const [location, setLocation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [createdSolarPlantId, setCreatedSolarPlantId] = useState(null);

    const [transformer, setTransformer] = useState("");
    const [inverter, setInverter] = useState("");

    const handleCreate = async () => {
        setErrorMessage("");
        try {
            if (!solarPlantName || !location) {
                throw new Error("Please fill in both plant name and location");
            }

            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/solarplants`, {
                name: solarPlantName,
                location,
                transformer,
                inverter
            });

            setCreatedSolarPlantId(response.data._id);
            navigate("/solarplantmanage")
        } catch (err) {
            console.error("Create plant failed:", err);
            const message =
                err.response?.data?.error || err.message || "Something went wrong";
            setErrorMessage(message);
        }
    };

    return (
        <div className="create-solar-container">
            <button className="back-button" onClick={() => {
                localStorage.clear();
                navigate(-1);
            }}>
                ⬅ Back
            </button>

            <div className="profile-section">
                <span className="profile-name">Username1</span>
                <img src="../logo.svg" alt="Profile" className="profile-picture" />
            </div>

            <div className="solar-plant-create">
                <div className="header">
                    <h2>Create Solar Plant</h2>
                </div>
            </div>

            <div className="form-card">
                <div className="form-left">
                    <label>Solar Plant Name</label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={solarPlantName}
                        onChange={(e) => setSolarPlantName(e.target.value)}
                    />

                    <label>Transformer</label>
                    <input
                        type="number"
                        value={transformer}
                        onChange={(e) => setTransformer(e.target.value)}
                    />

                    <label>Inverter</label>
                    <input
                        type="number"
                        value={inverter}
                        onChange={(e) => setInverter(e.target.value)}
                    />

                    <button className="create-zone" onClick={handleCreate}>Done</button>
                </div>

                <div className="form-right">
                    <label>Location</label>
                    <button
                        className="select-button"
                        onClick={() => setLocation("Bangkok")}
                    >
                        Select
                    </button>
                    <img src={solarPlantImage} alt="Map" className="map-image" />
                </div>
            </div>
        </div>
    );
};

export default CreateSolarPlant;
