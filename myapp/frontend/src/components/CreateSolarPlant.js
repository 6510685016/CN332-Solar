import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateSolarPlant = () => {
    const navigate = useNavigate();
    const [solarPlantName, setSolarPlantName] = useState("");
    const [location, setLocation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [createdSolarPlantId, setCreatedSolarPlantId] = useState(null);

    const handleCreate = async () => {
        setErrorMessage("");
        try {
            if (!solarPlantName || !location) {
                throw new Error("Please fill in both plant name and location");
            }

            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/solarplants`, {
                name: solarPlantName,
                location
            });

            setCreatedSolarPlantId(response.data._id);
        } catch (err) {
            console.error("Create plant failed:", err);
            const message =
                err.response?.data?.error || err.message || "Something went wrong";
            setErrorMessage(message);
        }
    };

    return (
        <div className="create-solar-container">
            <button
                style={{ marginTop: "1rem" }}
                onClick={() => navigate(-1)}
            >
                ⬅️ Back
            </button>
            <h2>Create Solar Plant</h2>
            <input placeholder="Plant name" value={solarPlantName} onChange={(e) => setSolarPlantName(e.target.value)} />
            <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <button onClick={handleCreate}>Done</button>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            {createdSolarPlantId && (
                <div style={{ marginTop: "1rem" }}>
                    <p>✅ Created: {solarPlantName}</p>
                    <button onClick={() =>
                        navigate("/createzone", {
                            state: {
                                solarPlantId: createdSolarPlantId,
                                solarPlantName
                            }
                        })
                    }>
                        ➕ Create Zone
                    </button>
                </div>
            )}


        </div>
    );

};

export default CreateSolarPlant;
