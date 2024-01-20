import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import the `useNavigate` hook for navigation
import { useNavigate } from 'react-router-dom';
// Import axios for making API requests
import axios from 'axios';

// Define the API URL
const API_URL = 'http://localhost:4000'; 

// Login component
function Login() {
  const [studentID, setStudentID] = useState('');
  const [name, setName] = useState('');
  const [creditsEarned, setCreditsEarned] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  // Initialize the `navigate` function from the `useNavigate` hook
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoginError(null);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        studentID: studentID,
        name: name,
        creditsEarned: creditsEarned,
      });

      const data = response.data;

      // Check if the login was successful based on the response
      if (response.status === 200) {
        console.log('login successful:', data);

        // Clear studnetID and name fields after successful login
        setStudentID('');
        setName('');
        setCreditsEarned('');
        setLoginSuccessMessage(data.message);

        // Navigate the the student-view page if successful
        navigate(`${process.env.PUBLIC_URL}/student-view`, {
          state: { studentID, name},
        });
      } else {
        setLoginError('login failed. Please check your studnetID and name.');
      }
    } catch (error) {
      console.error('login error:', error);
      setLoginError('login failed. Please check your studnetID and name.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {loginError && <p className="error">{loginError}</p>}
      {loginSuccessMessage && (
        <p className="success">{loginSuccessMessage}</p>
      )}
      <form>
        <div>
          <label>Student ID:</label>
          <input
            type="number"
            placeholder="Student ID"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          {'Login'}
        </button>
      </form>
      <div>
        Not registered? 
        <Link to={`${process.env.PUBLIC_URL}/student-register`}>
        Register here
        </Link>
      </div>

    </div>
  );
}

// Register component
function Register() {
  const [studentID, setStudentID] = useState('');
  const [name, setName] = useState('');
  const [creditsEarned, setCreditsEarned] = useState('');
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setRegisterError(null);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        studentID: studentID,
        name: name,
        creditsEarned: creditsEarned,
      });

      const data = response.data;

      // Clear form fields after successful register
      setStudentID('');
      setName('');
      setCreditsEarned('');
      setRegisterSuccessMessage(data.message);

      // Navigate the the login page if registed
      navigate(`${process.env.PUBLIC_URL}/student-login`);

    } catch (error) {
      setRegisterError('Register failed. User already exists or empty fields.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {registerError && <p className="error">{registerError}</p>}
      {registerSuccessMessage && (
        <p className="success">{registerSuccessMessage}</p>
      )}
      <form>
        <div>
          <label>Student ID:</label>
          <input
            type="number"
            placeholder="Student ID"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Credits Earned:</label>
          <input
            type="number"
            placeholder="Total Credits"
            value={creditsEarned}
            onChange={(e) => setCreditsEarned(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleRegister} >
          {'Register'}
        </button>
      </form>
      <div>
        Already registered? 
        <Link to={`${process.env.PUBLIC_URL}/student-login`}>
        Login here
        </Link>
      </div>
    </div>
  );
}

export { Login, Register }; 

