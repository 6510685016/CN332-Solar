import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/"); // ถ้าไม่มี token ให้ไปหน้า login
    } else {
        axios.get("http://localhost:5000/auth/user", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("API response:", response.data);
            setRoles(response.data.roles); // เก็บ roles ที่ได้จากฐานข้อมูล
            setPermissions(response.data.permissions); // เก็บ permissions ที่ได้จากฐานข้อมูล
            console.log("Permissions after set:", response.data.permissions);
        })
        .catch(error => {
            if (error.response) {
                console.error("Error response:", error.response);  
            } else if (error.request) {
                console.error("Error request:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            navigate("/");  
        });
    }
}, [navigate]);

  const handleRoleClick = (role) => {
    setSelectedRole(role); // เมื่อกดปุ่ม role, ให้เก็บ role นั้นใน selectedRole
  };

  // ฟังก์ชันตรวจสอบว่า user มี permission หรือไม่
  const hasPermission = (permission) => {
    console.log("add permission:", permission);
    console.log("Checking permission:", permissions);
    return permissions.includes(permission);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      
      {/* แสดงปุ่มสำหรับเลือก role */}
      {roles.includes("admin") && (
        <button onClick={() => handleRoleClick("admin")}>Admin</button>
      )}
      {roles.includes("dc") && (
        <button onClick={() => handleRoleClick("dc")}>DC</button>
      )}
      {roles.includes("da") && (
        <button onClick={() => handleRoleClick("da")}>Analyst</button>
      )}
      
      {/* แสดงปุ่มตาม role ที่ถูกเลือก */}
      {selectedRole === "admin" && (
        <>
          {hasPermission("manage_users") && <button>User board</button>}
          {hasPermission("manage_solar_plants") && <button>Solar board</button>}
        </>
      )}
      {selectedRole === "dc" && (
        <>
          {hasPermission("view_solar_plants") && <button>Task board</button>}
          {hasPermission("control_drones") && <button>Create Task</button>}
        </>
      )}
      {selectedRole === "da" && (
        <>
          {hasPermission("view_reports") && <button>Zone Dashboard</button>}
          {hasPermission("analyze_data") && <button>Analysis result</button>}
          {hasPermission("analyze_data") && <button>API Dashboard</button>}
        </>
      )}
      
      <button onClick={() => {
        localStorage.clear();
        navigate("/");  // Logout
      }}>Logout</button>
    </div>
  );
};

export default Dashboard;
