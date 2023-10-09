import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

function InstructorView() {
  const location = useLocation();
  const { instructorID, name } = location.state || {};
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`${API_URL}/instructor/courses/${instructorID}`)
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
      fetchData();
    }
  }, [instructorID]);

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleGradeSubmission = async (student) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validate the grade input
      if (!grade) {
        setErrorMessage('Grade is required');
        return;
      }

      // Send a POST request to add the grade for the specific student
      const response = await axios.post(`${API_URL}/add_grade/${instructorID}/${student.studentID}`, { grade });

      // Assuming your API returns a success message upon successful grade submission
      const data = response.data;

      // Clear the grade input after successful submission
      setGrade('');
      setSuccessMessage(data.message);
      //re-render
      axios.get(`${API_URL}/instructor/courses/${instructorID}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data.enrolled_students)) {
            setStudents(response.data.enrolled_students);
          } else {
            console.error('Invalid API response:', response.data);
          }
        })
    } catch (error) {
      setErrorMessage('Error submitting grade');
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
        <Link to="/">
          Log out
        </Link>
      </div>
    </div>
  );
}

export default InstructorView;



