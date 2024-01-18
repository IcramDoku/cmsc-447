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
    <Router>
      <div>
        <nav style={styles.navbar}>
          <Link to={`${process.env.PUBLIC_URL}/`} style={styles.link}>
            Home
          </Link>
          <Link to={`${process.env.PUBLIC_URL}/admin-dashboard`} style={styles.link}>
            Admin
          </Link>
          <Link to={`${process.env.PUBLIC_URL}/instructor-dashboard`} style={styles.link}>
            Instructor
          </Link>
          <Link to={`${process.env.PUBLIC_URL}/student-dashboard`} style={styles.link}>
            Student
          </Link>
        </nav>
        <Routes>
          <Route path={`${process.env.PUBLIC_URL}/`} element={<Dashboard />} />
          <Route path={`${process.env.PUBLIC_URL}/admin-dashboard`} element={<AdminDashboard />} />
          <Route path={`${process.env.PUBLIC_URL}/student-dashboard`} element={<StudentDashboard />} />
          <Route path={`${process.env.PUBLIC_URL}/instructor-dashboard`} element={<InstructorDashboard />} />
          <Route path={`${process.env.PUBLIC_URL}/student-register`} element={<Register />} />
          <Route path={`${process.env.PUBLIC_URL}/student-login`} element={<Login />} />
          <Route path={`${process.env.PUBLIC_URL}/admin-login`} element={<UserAdmin />} />
          <Route path={`${process.env.PUBLIC_URL}/student-view`} element={<StudentView />} />
          <Route path={`${process.env.PUBLIC_URL}/instructor-login`} element={<LoginInstructor />} />
          <Route path={`${process.env.PUBLIC_URL}/instructor-register`} element={<RegisterInstructor />} />
          <Route path={`${process.env.PUBLIC_URL}/instructor-view`} element={<InstructorView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


