import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserManage.css";
import logo from "../logo.svg";

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [profile, setProfile] = useState({ name: "", picture: logo });
    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            axios.get(`${process.env.REACT_APP_BACKEND}/auth/user`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setProfile({ 
                    name: response.data.username,  
                    picture: response.data.picture || logo  
                });
                setRoles(response.data.roles);
                setPermissions(response.data.permissions);
            })
            .catch(() => navigate("/login"));
        }
    
        // Fetch users from database
        axios.get(`${process.env.REACT_APP_BACKEND}/users`)
            .then(response => {
                setUsers(response.data);  // ✅ Store real users in state
            })
            .catch(error => console.error("Error fetching users:", error));
    }, [navigate]);
    

    // Handle Search Input
    const handleSearch = (e) => setSearch(e.target.value);

    // Open Modal
    const openModal = (type, user) => {
        setSelectedUser(user);
        setModalType(type);
        if (type === "role") {
            setSelectedRoles(user.roles || []);
        }
    };

    // Close Modal
    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
        setSelectedRoles([]);
    };

    // Handle Edit Role
    const handleEditRole = async () => {
        if (!selectedUser) return;

        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND}/users/update-role`, {
                userId: selectedUser._id,
                newRole: selectedRoles
            });

            alert(response.data.message);
            setUsers(users.map(user =>
                user._id === selectedUser._id ? { ...user, roles: selectedRoles } : user
            ));
            closeModal();
        } catch (error) {
            alert("Error updating role");
        }
    };

    // Handle Delete User
    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/users/delete/${selectedUser._id}`);
            alert(response.data.message);
            setUsers(users.filter(user => user._id !== selectedUser._id));
            closeModal();
        } catch (error) {
            alert("Error deleting user");
        }
    };

    const roleLabels = {
        admin: "Admin",
        dc: "Drone Controller",
        da: "Data Analyst"
    };

    const roleOrder = ["admin", "dc", "da"];

    return (
        <div className="user-manage-container">
            <button className="back-button" onClick={() => navigate("/dashboard")}>
                ⬅ Back
            </button>


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
                        user.username.toLowerCase().includes(search.toLowerCase()) ||
                        user.roles.some(role => role.toLowerCase().includes(search.toLowerCase()))
                    ).map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>
                                <button className="view-logs" onClick={() => openModal("logs", user)}>View Logs</button>
                            </td>
                            <td>
                                <button className="edit-plant" onClick={() => openModal("plant", user)}>Edit Plant</button>
                            </td>
                            <td>
                                {user.roles
                                    .sort((a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b)) // Sort roles
                                    .map((role) => roleLabels[role] || role) // Convert to display names
                                    .join(", ")}
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
                                <p>2h Assigned {selectedUser?.username} as Drone Controller</p>
                            </>
                        )}
                        {modalType === "plant" && (
                            <>
                                <h3>Edit Solar Plant</h3>
                                <p>Modify plant details for {selectedUser?.username}</p>
                            </>
                        )}
                        {modalType === "role" && (
                            <>
                                <h3>Change the role of {selectedUser?.username}</h3>
                                {Object.entries(roleLabels).map(([role, label]) => (
                                    <label key={role} style={{ display: "block" }}>
                                        {label}
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRoles([...selectedRoles, role]);
                                                } else {
                                                    setSelectedRoles(selectedRoles.filter((r) => r !== role));
                                                }
                                            }}
                                        />
                                    </label>
                                ))}
                            </>
                        )}
                        {modalType === "delete" && (
                            <>
                                <h3>Do you want to delete {selectedUser?.username}?</h3>
                            </>
                        )}
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={closeModal}>Cancel</button>
                            {modalType === "role" && (
                                <button className="confirm-button" onClick={handleEditRole}>Confirm</button>
                            )}
                            {modalType === "delete" && (
                                <button className="confirm-button" onClick={handleDeleteUser}>Confirm</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManage;
