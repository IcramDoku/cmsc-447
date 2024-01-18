import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Import various components and pages
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import { Login, Register } from './pages/student/UserStudent';
import UserAdmin from './pages/administrator/UserAdmin';
import StudentView from './pages/student/studentView';
import { LoginInstructor, RegisterInstructor } from './pages/instructor/UserInstructor';
import InstructorView from './pages/instructor/InstructorView';

// Styles for the navigation bar
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
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <nav style={styles.navbar}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/admin-dashboard" style={styles.link}>
            Admin
          </Link>
          <Link to="/instructor-dashboard" style={styles.link}>
            Instructor
          </Link>
          <Link to="/student-dashboard" style={styles.link}>
            Student
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
          <Route path="/student-register" element={<Register />} />
          <Route path="/student-login" element={<Login />} />
          <Route path="/admin-login" element={<UserAdmin />} />
          <Route path="/student-view" element={<StudentView />} />
          <Route path="/instructor-login" element={<LoginInstructor />} />
          <Route path="/instructor-register" element={<RegisterInstructor />} />
          <Route path="/instructor-view" element={<InstructorView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


