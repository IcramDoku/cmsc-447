import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Styles
const dashboardStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  options: {
    display: 'flex',
    justifyContent: 'center',
  },
  optionButton: {
    padding: '10px 20px',
    fontSize: '16px',
    margin: '10px',
    textDecoration: 'none',
    border: '1px solid #007BFF',
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
// The Dashboard component
function Dashboard() {
  // State to manage the password input
  const [password, setPassword] = useState('');

  // A function to navigate between pages
  const navigate = useNavigate();

  // Handle changes in the password input
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle the login action
  const handleLogin = () => {

    // This is the choosen only password to access the Admin page 'Admin123#!@' 
    // Only someone with this source code can know it
    if (password === 'Admin123#!@') {
      // If the login is successful, redirect to the admin dashboard
      navigate('/admin-login');
    } else {
      // Display an alert for an invalid password
      alert('Invalid password. Please try again.');
    }
  };

  return (
    <div style={dashboardStyles.container}>
      <h1 style={dashboardStyles.heading}>Welcome Admin!</h1>
      <p>You must sign in with your password:</p>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div style={dashboardStyles.options}>
        <button onClick={handleLogin} style={dashboardStyles.optionButton}>Login</button>
      </div>
    </div>
  );
}

export default Dashboard;

