import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//Import the `useNavigate` hook for navigation
import { useNavigate } from 'react-router-dom';
// Import axios for making API requests
import axios from 'axios';

// Define the API URL
const API_URL = 'http://127.0.0.1:5000'; 

// LoginInstructor component
function LoginInstructor() {
  const [instructorID, setinstructorID] = useState('');
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  // Initialize the `navigate` function from the `useNavigate` hook
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoginError(null);

    try {
      const response = await axios.post(`${API_URL}/instructor-login`, {
        instructorID: instructorID,
        name: name,
      });

      const data = response.data;

      // Check if the login was successful based on the response
      if (response.status === 200) {
        console.log('login successful:', data);

        // Clear fields after successful login
        setinstructorID('');
        setName('');
        setLoginSuccessMessage(data.message);

        // Navigate the the instructor-view page if logged in
        navigate(`${process.env.PUBLIC_URL}/instructor-view`, {
          state: { instructorID, name},
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
          <label>Instructor ID:</label>
          <input
            type="number"
            placeholder="Instructor ID"
            value={instructorID}
            onChange={(e) => setinstructorID(e.target.value)}
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
        <Link to={`${process.env.PUBLIC_URL}/instructor-register`}>
        Register here
        </Link>
      </div>

    </div>
  );
}

// RegisterInstructor component
function RegisterInstructor() {
  const [instructorID, setinstructorID] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setRegisterError(null);

    try {
      const response = await axios.post(`${API_URL}/instructors`, {
        instructorID: instructorID,
        name: name,
        department: department,
      });
      const data = response.data;

      // Clear form fields after successful register
      setinstructorID('');
      setName('');
      setDepartment('');
      setRegisterSuccessMessage(data.message);

      // Navigate the the login page if registed
      navigate(`${process.env.PUBLIC_URL}/instructor-login`);

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
          <label>Instructor ID:</label>
          <input
            type="number"
            placeholder="Instructor ID"
            value={instructorID}
            onChange={(e) => setinstructorID(e.target.value)}
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
          <label>Department:</label>
          <input
            type="text"
            placeholder="Department Name"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleRegister} >
          {'Register'}
        </button>
      </form>
      <div>
        Already registered? 
        <Link to={`${process.env.PUBLIC_URL}/instructor-login`}>
        Login here
        </Link>
      </div>
    </div>
  );
}

export { LoginInstructor, RegisterInstructor }; 

