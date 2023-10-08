import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; 

function LoginInstructor() {
  const [instructorID, setinstructorID] = useState('');
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
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
        // Handle successful login here, e.g., navigate to a new page or store user data
        console.log('login successful:', data);

        // Clear studnetID and name fields after successful login
        setinstructorID('');
        setName('');
        setLoginSuccessMessage(data.message);

        // Use the "useNavigate" hook to navigate to "/student-view" with query parameters
        navigate('/instructor-view', {
          state: { instructorID, name}, // Pass instructorID and name as query parameters
        });
      } else {
        // Handle login failure
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
        <Link to="/instructor-register">
        Register here
        </Link>
      </div>

    </div>
  );
}


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

      // Assuming your API returns a success message or user data upon successful signup
      const data = response.data;

      // Clear form fields after successful register
      setinstructorID('');
      setName('');
      setDepartment('');
      setRegisterSuccessMessage(data.message);
      // You can handle the successful register response here.
      navigate('/instructor-login');

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
        <Link to="/instructor-login">
        Login here
        </Link>
      </div>
    </div>
  );
}

export { LoginInstructor, RegisterInstructor }; 

