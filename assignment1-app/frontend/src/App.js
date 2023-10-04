import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/users'; // Replace with your API URL

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = () => {
    setIsLoading(true);
    axios
      .get(API_URL)
      .then((response) => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>User List</h1>

      <button onClick={fetchUsers} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Users'}
      </button>

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>User ID:</strong> {user._id}<br />
            <strong>Username:</strong> {user.username}<br />
            <strong>Name:</strong> {user.name}<br />
            <strong>Password:</strong> {user.password}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;




