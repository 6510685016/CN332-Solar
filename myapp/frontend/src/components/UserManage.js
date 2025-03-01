import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserManage.css";
import logo from "../logo.svg";

const Dashboard = () => {
    const [users] = useState([
        { id: 1, name: "Adum Papaya Salad", role: "(3) Admin , Drone C. , Data A" }
    ]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [search, setSearch] = useState("");
    const [profile, setProfile] = useState({ name: "AmongUs", picture: logo });
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
                    setProfile({ name: response.data.name, picture: response.data.picture });
                })
                .catch(() => navigate("/"));
        }
    }, [navigate]);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );

    const hasPermission = (permission) => permissions.includes(permission);

    return (
        <div className="dashboard-container">
            <button className="back-button" onClick={() => {
                localStorage.clear();
                navigate("/");
            }}>⬅ Back</button>

            <div className="profile-section">
                <span className="profile-name">{profile.name}</span>
                <img src={profile.picture} alt="Profile" className="profile-picture" />
            </div>

            <h2 className="dashboard-title">User Manage Dashboard</h2>

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
                    {filteredUsers.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td><button className="view-logs">View Logs</button></td>
                            <td><button className="edit-plant">Edit Plant</button></td>
                            <td>{user.role}
                                <button className="edit-role">Edit Role</button>
                            </td>
                            <td>
                                <button className="delete-user">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;