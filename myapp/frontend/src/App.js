import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "./services/userService";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleAddUser = async () => {
    const newUser = await createUser({ name });
    setUsers([...users, newUser]);
    setName("");
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
}

export default App;