import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

function UserAdmin() {
  // Instructors
  const [instructors, setInstructors] = useState([]);
  const [instructorID, setInstructorID] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  // Courses
  const [courses, setCourses] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [courseTitle, setCourseTitle] = useState('');

  const [assignedCourses, setAssignedCourses] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch instructors and courses from the server on component mount
    axios.get(`${API_URL}/instructors`)
      .then((response) => {
        setInstructors(response.data);
      })
      .catch((error) => {
        console.error('Error fetching instructors:', error);
      });

    axios.get(`${API_URL}/courses`)
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const handleAddCourse = async () => {
    try {
      const response = await axios.post(`${API_URL}/courses`, {
        courseID: courseID,
        courseTitle: courseTitle,
        instructorID: instructorID,
      });

      const data = response.data;

      setCourseID('');
      setCourseTitle('');
      setInstructorID('');
      navigate('/admin-login');
    } catch (error) {
      console.error('Error in add course: ', error);
    }
  };

  // The handleRemoveCourse function
  const handleRemoveCourse = async (courseID) => { // Corrected parameter name here
    try {
      await axios.delete(`${API_URL}/courses/${courseID}`); // Corrected endpoint here

      // Update the state to remove the course from the list
      setCourses(courses.filter((course) => course.id !== courseID));

      // Optionally, you can display a success message or perform other actions upon successful removal.
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error('Error removing course:', error);
    }
  };

  const handleAddInstructor = async () => {
    try {
      const response = await axios.post(`${API_URL}/instructors`, {
        instructorID: instructorID,
        name: name,
        department: department,
      });

      const data = response.data;

      setInstructorID('');
      setName('');
      setDepartment('');

    } catch (error) {
      console.error('Error in add instructor: ', error);
    }
  };

  const handleRemoveInstructor = async (instructorID) => {
    try {
      // Send a DELETE request to remove the course by its ID
      await axios.delete(`${API_URL}/instructors/${instructorID}`);
  
      // Update the state to remove the course from the list
      setInstructors(instructors.filter((instructor) => instructor.id !== instructorID));
  
      // Optionally, you can display a success message or perform other actions upon successful removal.
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error('Error removing course:', error);
    }
  };

  const assignInstructor = () => {
    if (!courseID || !instructorID) {
      setAssignmentStatus('Missing course or instructor');
      return;
    }

    axios
      .post(`${API_URL}/assign`, {
        courseID,
        instructorID,
      })
      .then((response) => {
        console.log('Server response:', response.data);
        const assignedCourse = {
          courseID,
          instructorID,
        };
        setAssignedCourses([...assignedCourses, assignedCourse]);
        setAssignmentStatus('Instructor assigned successfully');
      })
      .catch((error) => {
        if (error.response) {
          // The request was made, but the server responded with a status code
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received. Request:', error.request);
        } else {
          // Something else went wrong
          console.error('Error:', error.message);
        }
        console.error('Error assigning instructor to course:', error);
        setAssignmentStatus('Error assigning instructor');
      });
  };

  return (
    // Inside your component's return statement
    <div>
      <h1>Admin Dashboard</h1>

      {/* Course Management */}
      <h2>Course Management</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.courseID}{' '}
            {course.courseTitle}{' '}
            <button onClick={() => handleRemoveCourse(course.courseID)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Course ID"
          onChange={(e) => setCourseID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course Title"
          onChange={(e) => setCourseTitle(e.target.value)}
        />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>

      {/* Instructor Management */}
      <h2>Instructor Management</h2>
      <ul>
        {instructors.map((instructor) => (
          <li key={instructor.id}>
            {instructor.instructorID}{' '}
            {instructor.name}{' '}
            {instructor.department}{' '}
            <button onClick={() => handleRemoveInstructor(instructor.instructorID)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Instructor ID"
          onChange={(e) => setInstructorID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Instructor Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Department"
          onChange={(e) => setDepartment(e.target.value)}
        />
        <button onClick={handleAddInstructor}>Add Instructor</button>
      </div>

      {/* Assign Instructors to Courses */}
      <h2>Assign Instructors to Courses</h2>
      <ul>
        {assignedCourses.map((assignment, index) => (
          <li key={index}>
            Course ID: {assignment.courseID}, Instructor ID: {assignment.instructorID}
          </li>
        ))}
      </ul>
      <div>
        <select onChange={(e) => setCourseID(e.target.value)}>
          <option value="">Select Course</option>
          {/* Render your course options here */}
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseID}
            </option>
          ))}
        </select>
        <select onChange={(e) => setInstructorID(e.target.value)}>
          <option value="">Select Instructor</option>
          {/* Render your instructor options here */}
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.instructorID}
            </option>
          ))}
        </select>
        <button onClick={assignInstructor}>Assign</button>
      </div>
      {assignmentStatus && <p>{assignmentStatus}</p>}
    </div>

  );
};

export default UserAdmin;
