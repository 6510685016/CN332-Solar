import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateZone.css";

const CreateZone = () => {
    const navigate = useNavigate();

    const [zoneName, setZoneName] = useState("");
    const [numSolarX, setNumSolarX] = useState("");
    const [numSolarY, setNumSolarY] = useState("");

    const BACKEND_URL = process.env.REACT_APP_BACKEND


    const handleDone = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/zones`, {
                zoneName: "Default",
                numSolarX: 3,
                numSolarY: 3,
            });

            console.log("Zone Created:", response.data);
        } catch (error) {
            console.error("Failed to create zone:", error);
        }
    };

    return (
        <div>
            <h1>It's Work</h1>
            <button onClick={handleDone}>Done</button>
        </div>
        // <div className="create-zone-container">
        //     <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>

        //     <div className="profile-section">
        //         <span className="profile-name">Username1</span>
        //         <img src="/path/to/profile.png" alt="Profile" className="profile-picture" />
        //     </div>

        //     <div className="zone-form-container">
        //         <h2>Create Zone in Solar Plant A</h2>

        //         <div className="form-group">
        //             <label>Zone ID</label>
        //             <input
        //                 type="text"
        //                 value={zoneId}
        //                 onChange={(e) => setZoneId(e.target.value)}
        //                 className="form-input"
        //             />
        //         </div>

        //         <div className="form-group">
        //             <label>Area</label>
        //             <input
        //                 type="text"
        //                 value={area}
        //                 onChange={(e) => setArea(e.target.value)}
        //                 className="form-input"
        //             />
        //         </div>

        //         <div className="form-group">
        //             <label>Transformer</label>
        //             <input
        //                 type="text"
        //                 value={transformer}
        //                 onChange={(e) => setTransformer(e.target.value)}
        //                 className="form-input"
        //             />
        //         </div>

        //         <div className="form-group">
        //             <label>Inverter</label>
        //             <input
        //                 type="text"
        //                 value={inverter}
        //                 onChange={(e) => setInverter(e.target.value)}
        //                 className="form-input"
        //             />
        //         </div>

        //         <button className="done-button" onClick={handleDone}>Done</button>
        //     </div>

        //     <div className="image-container">
        //         <h3>Solar Plant A</h3>
        //         <img src="/path/to/solarplant.png" alt="Solar Plant" className="solar-image" />
        //     </div>
        // </div>
    );
};

export default CreateZone;
