import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API requests

function InstructorView() {
  const location = useLocation();
  const { instructorID, name } = location.state || {};
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);


  return (
    <div>
      <div>
        <h1>Welcome to Student View</h1>
        {instructorID && <p>Student ID: {instructorID}</p>}
        {name && <p>Name: {name}</p>}
        {/* Your student view content here */}
      </div>
      <h1>Hello, {name}!</h1>
      <table>
        <tbody>
          {/*enrolledCourses.map((course) => (*/}
        </tbody>
      </table>
      <h2>List of My Students:</h2>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Course Title</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
      <div>
        <Link to="/">
        Log out
        </Link>
      </div>
    </div>
  );
}


export default InstructorView;
