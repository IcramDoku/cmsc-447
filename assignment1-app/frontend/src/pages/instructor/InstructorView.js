import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Import axios for making API requests
import axios from 'axios';

// InstructorView component
function InstructorView() {
  // Get the current location
  const location = useLocation();
  const { instructorID, name } = location.state || {};
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState('');

  const API_URL = 'https://cmsc447.pythonanywhere.com';

  useEffect(() => {
    // Fetch data for the instructor and their students
    const fetchData = async () => {
      // Get a list of students enrolled in courses taught by this instructor
      axios.get(`${API_URL}/instructor/courses/${instructorID}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data.enrolled_students)) {
            setStudents(response.data.enrolled_students);
          } else {
            console.error('Invalid API response:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching students:', error);
        });
      
      // Get the department of the instructor
      axios.get(`${API_URL}/department/${instructorID}`)
        .then((response) => {
          console.log("API department:", response.data);
          setDepartment(response.data.department);
        })
        .catch((error) => {
          console.error('Error fetching department:', error);
        });
    };

    if (instructorID) {
      // Call fetchData when the instructorID changes
      fetchData();
    }
  }, [instructorID]);

  const handleGradeSubmission = async (student) => {
    try {
      // Send a POST request to add the grade for the specific student
      await axios.post(`${API_URL}/add_grade/${instructorID}/${student.studentID}`, { grade });

      // Clear the grade input
      setGrade('');

      // Re-fetch the list of students and their grades
      axios.get(`${API_URL}/instructor/courses/${instructorID}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data.enrolled_students)) {
            setStudents(response.data.enrolled_students);
          } else {
            console.error('Invalid API response:', response.data);
          }
        })
    } catch (error) {
      console.log('Error submitting grade', error);
    }
  };

  return (
    <div>
      <div>
        <h1>Welcome to Instructor View</h1>
        {instructorID && <p>Instructor ID: {instructorID}</p>}
        {name && <p>Name: {name}</p>}
        {department && <p>Department: {department}</p>}
      </div>
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
          {students.map((student) => (
            <tr key={student.studentID}>
              <td>{student.studentID}</td>
              <td>{student.studentName}</td>
              <td>{student.courseTitle}</td>
              <td>
                {selectedStudent === student ? (
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                ) : (
                  student.grade
                )}
              </td>
              <td>
                {selectedStudent === student ? (
                  <button onClick={() => handleGradeSubmission(student)}>Submit Grade</button>
                ) : (
                  <button onClick={() => setSelectedStudent(student)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Link to={`${process.env.PUBLIC_URL}/instructor-dashboard`}>
          Log out
        </Link>
      </div>
    </div>
  );
}

export default InstructorView;



