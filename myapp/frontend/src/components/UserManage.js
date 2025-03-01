import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserManage.css";
import logo from "../logo.svg";

const UserManage = () => {
    const [users] = useState([
        { id: 1, name: "Adum Papaya Salad", role: "(3) Admin , DC. , DA" },
        { id: 2, name: "Nelga", role: "(1) Drone C" }
    ]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [search, setSearch] = useState("");
    const [profile] = useState({ name: "AmongUs", picture: logo });

    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            axios.get("http://localhost:5000/auth/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setRoles(response.data.roles);
                    setPermissions(response.data.permissions);
                })
                .catch(() => navigate("/"));
        }
    }, [navigate]);

    const handleSearch = (e) => setSearch(e.target.value);

    const openModal = (type, user) => {
        setSelectedUser(user);
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
    };

    return (
        <div className="user-manage-container">
            <button className="back-button" onClick={() => {
                localStorage.clear();
                navigate("/");
            }}>⬅ Back</button>

            <div className="profile-section">
                <span className="profile-name">{profile.name}</span>
                <img src={profile.picture} alt="Profile" className="profile-picture" />
            </div>

            <h2 className="user-manage-title">User Manage Dashboard</h2>

            <input
                type="text"
                placeholder="Username/Role"
                value={search}
                onChange={handleSearch}
                className="search-bar"
            />

            <table className="user-table">
                <thead>
                    <tr>
                        <th>-</th>
                        <th>Name</th>
                        <th>Logs</th>
                        <th>Solar Plant</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter(user => 
                        user.name.toLowerCase().includes(search.toLowerCase()) ||
                        user.role.toLowerCase().includes(search.toLowerCase())
                    ).map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td><button className="view-logs" onClick={() => openModal("logs", user)}>View Logs</button></td>
                            <td><button className="edit-plant" onClick={() => openModal("plant", user)}>Edit Plant</button></td>
                            <td>{user.role}
                                <button className="edit-role" onClick={() => openModal("role", user)}>Edit Role</button>
                            </td>
                            <td>
                                <button className="delete-user" onClick={() => openModal("delete", user)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Section */}
            {modalType && (
                <div className="modal-overlay">
                    <div className="modal">
                        {modalType === "logs" && (
                            <>
                                <h3>My Activity</h3>
                                <p>2h Assigned {selectedUser?.name} As Drone Controller</p>
                            </>
                        )}
                        {modalType === "plant" && (
                            <>
                                <h3>Edit Solar Plant</h3>
                                <p>Modify plant details for {selectedUser?.name}</p>
                            </>
                        )}
                        {modalType === "role" && (
                            <>
                                <h3>Change the role of user.</h3>
                                <label>Admin<input type="checkbox" /></label>
                                <label>Drone Controller<input type="checkbox" /></label>
                                <label>Data Analyst<input type="checkbox" /></label>
                            </>
                        )}
                        {modalType === "delete" && (
                            <>
                                <h3>Do you want to delete this user?</h3>
                            </>
                        )}
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={closeModal}>Cancel</button>
                            {modalType === "role" || modalType === "delete" ? (
                                <button className="confirm-button">Confirm</button>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManage;
