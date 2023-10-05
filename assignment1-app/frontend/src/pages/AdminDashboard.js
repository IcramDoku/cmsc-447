import React from 'react';
import { Link } from 'react-router-dom';

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

function Dashboard() {
  return (
    <div style={dashboardStyles.container}>
      <h1 style={dashboardStyles.heading}>Welcome Admin!</h1>
      <p>You must sign in with your username and password:</p>
      <div style={dashboardStyles.options}>
        <Link to="/admin-login" style={dashboardStyles.optionButton}>
        Login
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
