import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; 

function Login() {
  const [studentID, setStudentID] = useState('');
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const navigate = useNavigate(); //navigate to a new page

  const handleLogin = async () => {
    setLoginError(null);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        studentID: studentID,
        name: name,
      });

      const data = response.data;

      // Check if the login was successful based on the response
      if (response.status === 200) {
        // Handle successful login here, e.g., navigate to a new page or store user data
        console.log('login successful:', data);

        // Clear studnetID and name fields after successful login
        setStudentID('');
        setName('');
        setLoginSuccessMessage(data.message);
        navigate('/student-view');
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
          <label>Student ID:</label>
          <input
            type="number"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
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
        <Link to="/student-register">
        Register here
        </Link>
      </div>

    </div>
  );
}


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

      // Assuming your API returns a success message or user data upon successful signup
      const data = response.data;

      // Clear form fields after successful register
      setStudentID('');
      setName('');
      setCreditsEarned('');
      setRegisterSuccessMessage(data.message);
      // You can handle the successful register response here.
      navigate('/student-login');

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
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Credits Earned:</label>
          <input
            type="number"
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
        <Link to="/student-login">
        Login here
        </Link>
      </div>
    </div>
  );
}

export { Login, Register }; 

