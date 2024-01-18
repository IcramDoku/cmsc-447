import React from 'react';
import { Link } from 'react-router-dom';

// Defines the Styles
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

// The Student Dashboard component
function Dashboard() {
  return (
    <div style={dashboardStyles.container}>
      <h1 style={dashboardStyles.heading}>Welcome Student!</h1>
      <p>Please select an option:</p>
      <div style={dashboardStyles.options}>
      <Link to={`${process.env.PUBLIC_URL}/student-login`} style={dashboardStyles.optionButton}>
        Login
      </Link>
      <Link to={`${process.env.PUBLIC_URL}/student-register`} style={dashboardStyles.optionButton}>
        Register
      </Link>

      </div>
    </div>
  );
}

export default Dashboard;






