import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Replace with your API URL

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setSignInError(null);

    try {
      const response = await axios.post(`${API_URL}/signin`, {
        username: username,
        password: password,
      });

      const data = response.data;

      // Check if the sign-in was successful based on the response
      if (response.status === 200) {
        // Handle successful sign-in here, e.g., navigate to a new page or store user data
        console.log('Sign-in successful:', data);

        // Clear username and password fields after successful sign-in
        setUsername('');
        setPassword('');
      } else {
        // Handle sign-in failure
        setSignInError('Sign-in failed. Please check your username and password.');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setSignInError('Sign-in failed. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {signInError && <p className="error">{signInError}</p>}
      
      <form>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}


function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState('');

  const handleSignUp = async () => {
    setIsLoading(true);
    setSignupError(null);

    try {
      const response = await axios.post(`${API_URL}/users`, {
        username: username,
        password: password,
        name: name,
      });

      // Assuming your API returns a success message or user data upon successful signup
      const data = response.data;
      // You can handle the successful signup response here.

      // Clear form fields after successful signup
      setUsername('');
      setPassword('');
      setName('');
      setSignupSuccessMessage(data.message);

    } catch (error) {
      setSignupError('Sign-up failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {signupError && <p className="error">{signupError}</p>}
      {signupSuccessMessage && (
        <p className="success">{signupSuccessMessage}</p>
      )}
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleSignUp} disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <div>
        Already have an account? 
        <Link to="/student-login">
        Login
        </Link>
      </div>
    </div>
  );
}

export { SignIn, SignUp }; 

