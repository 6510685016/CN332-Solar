import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateSolarPlant.css";
import solarPlantImage from "./picture/createsolarplant.png";
import logo from "../logo.svg";

const CreateSolarPlant = () => {
    const [profile, setProfile] = useState({ name: "", picture: logo });
    const navigate = useNavigate();

    const [solarPlantName, setSolarPlantName] = useState("");
    const [location, setLocation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [createdSolarPlantId, setCreatedSolarPlantId] = useState(null);
    const [creationSuccess, setCreationSuccess] = useState(false);

    const [transformer, setTransformer] = useState("");
    const [inverter, setInverter] = useState("");

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
    }, [navigate]);

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
            setCreationSuccess(true);
        } catch (err) {
            console.error("Create plant failed:", err);
            const message =
                err.response?.data?.error || err.message || "Something went wrong";
            setErrorMessage(message);
        }
    };

    const handleCreateZone = () => {
        navigate("/createzone", {
            state: {
                solarPlantId: createdSolarPlantId,
                solarPlantName
            }
        });
    };

    const handleViewAllPlants = () => {
        navigate("/solarplantmanage");
    };

    return (
        <div className="create-solar-container">
            <button className="back-button" onClick={() => {
                navigate(-1);
            }}>
                ⬅ Back
            </button>

            <div className="profile-section">
                <span className="profile-name">{profile.name}</span>
                <img src={profile.picture} alt="Profile" className="profile-picture" />
            </div>

            <div className="solar-plant-create">
                <div className="header">
                    <h2>Create Solar Plant</h2>
                </div>
            </div>

            <div className="form-card">
                <div className="form-left">
                    <label>Solar Plant Name <span style={{ color: "red" }}>*</span></label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={solarPlantName}
                        onChange={(e) => setSolarPlantName(e.target.value)}
                    />

                    <label>Transformer</label>
                    <input
                        type="number"
                        placeholder="Transformer value"
                        value={transformer}
                        onChange={(e) => setTransformer(e.target.value)}
                    />

                    <label>Inverter</label>
                    <input
                        type="number"
                        placeholder="Inverter value"
                        value={inverter}
                        onChange={(e) => setInverter(e.target.value)}
                    />

                    {!creationSuccess ? (
                        <>
                            <button className="create-zone" onClick={handleCreate}>Create Plant</button>
                            {errorMessage && <p className="error-message" style={{ color: "red" }}>{errorMessage}</p>}
                        </>
                    ) : (
                        <div className="success-actions">
                            <p style={{ color: "green", marginTop: "1rem" }}>✅ Created: {solarPlantName}</p>
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button onClick={handleCreateZone} style={{ backgroundColor: "#4CAF50", color: "white", padding: "8px 16px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                                    ➕ Create Zone
                                </button>
                                <button onClick={handleViewAllPlants} style={{ backgroundColor: "#6c63ff", color: "white", padding: "8px 16px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                                    View All Plants
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-right">
                    <label>Location <span style={{ color: "red" }}>*</span></label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button
                            className="select-button"
                            onClick={() => setLocation("Bangkok")}
                        >
                            Select
                        </button>
                    </div>
                    <img src={solarPlantImage} alt="Map" className="map-image" />
                </div>
            </div>
        </div>
    );
};

export default CreateSolarPlant;