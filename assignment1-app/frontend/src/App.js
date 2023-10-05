import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/users'; // Replace with your API URL

function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Track whether the user is signing up
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = () => {
    // You should add authentication logic here, e.g., by sending a request to your backend API to verify credentials.
    // For this example, let's assume successful login for demonstration purposes.
    setIsLoggedIn(true);
    fetchUsers(); // Fetch user data after login
  };

  const handleSignup = () => {
    // You should add signup logic here, e.g., by sending a request to your backend API to create a new user.
    // For this example, let's assume successful signup for demonstration purposes.
    setIsLoggedIn(true);
    setIsSignUp(false); // After signup, switch to signin mode
    fetchUsers(); // Fetch user data after signup
  };

  useEffect(() => {
    // You can also fetch user data here when the component loads initially.
    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      <h1>User List</h1>

      {isLoggedIn ? (
        <div>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
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
      ) : (
        <div>
          {isSignUp ? (
            <div>
              <h2>Sign Up</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleSignup}>Sign Up</button>
              <p>
                Already have an account?{' '}
                <span onClick={() => setIsSignUp(false)}>Sign In</span>
              </p>
            </div>
          ) : (
            <div>
              <h2>Sign In</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Sign In</button>
              <p>
                Don't have an account?{' '}
                <span onClick={() => setIsSignUp(true)}>Sign Up</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;





