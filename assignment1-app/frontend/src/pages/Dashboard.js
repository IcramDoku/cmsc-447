import React from 'react';
import { Link } from 'react-router-dom';

// Styles for the Dashboard component
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
  return (
    <div style={dashboardStyles.container}>
      <h1 style={dashboardStyles.heading}>Welcome to the Dashboard!</h1>
      <p>Please select an option:</p>
      <div style={dashboardStyles.options}>
      <Link to={`${process.env.PUBLIC_URL}/admin-dashboard`} style={dashboardStyles.optionButton}>
        Admin
      </Link>
      <Link to={`${process.env.PUBLIC_URL}/instructor-dashboard`} style={dashboardStyles.optionButton}>
        Instructor
      </Link>
      <Link to={`${process.env.PUBLIC_URL}/student-dashboard`} style={dashboardStyles.optionButton}>
        Student
      </Link>
      </div>
    </div>
  );
}

export default Dashboard;



