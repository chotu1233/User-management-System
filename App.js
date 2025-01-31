import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', company: { name: '' } });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError(null); // Reset error before API call
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const addUser = async () => {
    try {
      setError(null);
      const response = await axios.post(API_URL, newUser);
      setUsers([...users, { ...response.data, id: users.length + 1 }]);
      setNewUser({ name: '', email: '', company: { name: '' } });
    } catch (error) {
      setError("Failed to add user. Please check your input and try again.");
    }
  };

  const startEditing = (user) => {
    setEditUser(user);
  };

  const handleEditInputChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const editUserRequest = async () => {
    try {
      setError(null);
      await axios.put(`${API_URL}/${editUser.id}`, editUser);
      setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
      setEditUser(null);
    } catch (error) {
      setError("Failed to update user. Please try again.");
    }
  };

  const deleteUser = async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      setError("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>User Management Dashboard</h1>

      {error && <p className="error">{error}</p>} {/* Show error messages */}

      {/* Add User Form */}
      <div className="form-container">
        <h2>Add New User</h2>
        <input type="text" name="name" placeholder="Full Name" value={newUser.name} onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleInputChange} />
        <input type="text" name="company.name" placeholder="Company" value={newUser.company.name} onChange={handleInputChange} />
        <button onClick={addUser}>Add User</button>
      </div>

      {/* Edit User Form */}
      {editUser && (
        <div className="form-container">
          <h2>Edit User</h2>
          <input type="text" name="name" value={editUser.name} onChange={handleEditInputChange} />
          <input type="email" name="email" value={editUser.email} onChange={handleEditInputChange} />
          <input type="text" name="company.name" value={editUser.company.name} onChange={handleEditInputChange} />
          <button onClick={editUserRequest} className="edit">Save Changes</button>
          <button onClick={() => setEditUser(null)} className="cancel">Cancel</button>
        </div>
      )}

      {loading ? <p>Loading users...</p> : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company?.name}</td>
                <td>
                  <button onClick={() => startEditing(user)} className="edit">Edit</button>
                  <button onClick={() => deleteUser(user.id)} className="delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
