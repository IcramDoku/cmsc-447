import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { Login, Register } from './pages/student/UserStudnet';


const styles = {
  navbar: {
    position: 'sticky',
    top: '0',
    backgroundColor: '#007BFF',
    padding: '10px',
    textAlign: 'left',
    zIndex: '100',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    margin: '0 10px',
  },
};

function App() {
  return (
    <Router>
      <div>
        <nav style={styles.navbar}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/admin-dashboard" style={styles.link}>
            Admin
          </Link>
          <Link to="/student-dashboard" style={styles.link}>
            Student
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-register" element={<Register />} />
          <Route path="/student-login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


