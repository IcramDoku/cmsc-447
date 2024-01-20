import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://cmsc-447.vercel.app';

function UserAdmin() {
  // State for managing instructors
  const [instructors, setInstructors] = useState([]);
  const [instructorID, setInstructorID] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  // State for managing courses
  const [courses, setCourses] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [courseTitle, setCourseTitle] = useState('');

  // State for managing assigned courses and status messages
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState(null);
  const [courseStatus, setCourseStatus] = useState(null);
  const [instructorStatus, setInstructorStatus] = useState(null);

  // Use the useEffect hook to fetch data from the server
  useEffect(() => {
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

  // Function to handle adding a course
  const handleAddCourse = async () => {
    if (!courseID || !courseTitle) {
      setCourseStatus('Missing course ID or course title');
      return;
    }

    try {
      // Send a POST request to add a new course
      await axios.post(`${API_URL}/courses`, {
        courseID: courseID,
        courseTitle: courseTitle,
        instructorID: instructorID,
      });
      setCourseStatus('Course created successfully!');

      // Clear input fields
      setCourseID('');
      setCourseTitle('');
      setInstructorID('');

      // Re-fetch courses to update the list
      axios.get(`${API_URL}/courses`)
      .then((response) => {
        setCourses(response.data);
      })    

    } catch (error) {
      console.error('Error in add course: ', error);
    }
  };

  // Function to handle removing a course
  const handleRemoveCourse = async (courseID) => { 
    try {
      // Send a DELETE request to remove a course by its ID
      await axios.delete(`${API_URL}/courses/${courseID}`);

      // Update the state to remove the course from the list
      setCourses(courses.filter((course) => course.id !== courseID));

      // Re-fetch courses to update the list
      axios.get(`${API_URL}/courses`)
      .then((response) => {
        setCourses(response.data);
      })

    } catch (error) {
      console.error('Error removing course:', error);
    }
  };

  // Function to handle adding an instructor
  const handleAddInstructor = async () => {
    if (!instructorID || !name || !department) {
      setInstructorStatus('Missing instructorID, name, or department');
      return;
    }

    try {
      // Send a POST request to add a new instructor
      await axios.post(`${API_URL}/instructors`, {
        instructorID: instructorID,
        name: name,
        department: department,
      });
      setInstructorStatus('Instructor created successfully!');

      // Clear input fields
      setInstructorID('');
      setName('');
      setDepartment('');

      // Re-fetch instructors to update the list
      axios.get(`${API_URL}/instructors`)
      .then((response) => {
        setInstructors(response.data);
      })

    } catch (error) {
      console.error('Error in add instructor: ', error);
    }
  };

  // Function to handle removing an instructor
  const handleRemoveInstructor = async (instructorID) => {
    try {
      // Send a DELETE request to remove the course by its ID
      await axios.delete(`${API_URL}/instructors/${instructorID}`);
  
      // Update the state to remove the course from the list
      setInstructors(instructors.filter((instructor) => instructor.id !== instructorID));
      
      // Re-fetch instructors to update the list
      axios.get(`${API_URL}/instructors`)
      .then((response) => {
        setInstructors(response.data);
      })

    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error('Error removing course:', error);
    }
  };

  // Function to assign an instructor to a course
  const assignInstructor = () => {
    if (!courseID || !instructorID) {
      setAssignmentStatus('Missing course or instructor');
      return;
    }

    axios.post(`${API_URL}/assign`, {
        courseID,
        instructorID,
      }).then((response) => {
        console.log('Server response:', response.data);
        const assignedCourse = {
          courseID,
          instructorID,
        };
        setAssignedCourses([...assignedCourses, assignedCourse]);
        setAssignmentStatus('Instructor assigned successfully!');
        // Re-fetch courses to update the list
        axios.get(`${API_URL}/courses`)
        .then((response) => {
          setCourses(response.data);
        })
        // Clear after successful assignment
        setCourseID('');
        setInstructorID('');
      })
      .catch((error) => {
        if (error.response) {
          // The request was made, but the server responded with a status code
          console.error('Response data:', error.response.data);
        } else {
          // Something else went wrong
          console.error('Error:', error.message);
        }
        console.error('Error assigning instructor to course:', error);
        setAssignmentStatus('Error assigning instructor');
      });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Course Management</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.courseID}{' '}
            {course.courseTitle}{' '}
            {course.instructorID}{' '}
            <button onClick={() => handleRemoveCourse(course.courseID)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="number"
          placeholder="Course ID"
          value={courseID}
          onChange={(e) => setCourseID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course Title"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
        />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>
      {courseStatus && <p>{courseStatus}</p>}

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
          type="number"
          placeholder="Instructor ID"
          value={instructorID}
          onChange={(e) => setInstructorID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Instructor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <button onClick={handleAddInstructor}>Add Instructor</button>
      </div>
      {instructorStatus && <p>{instructorStatus}</p>}

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
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseID}
            </option>
          ))}
        </select>
        <select onChange={(e) => setInstructorID(e.target.value)}>
          <option value="">Select Instructor</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.instructorID}
            </option>
          ))}
        </select>
        <button onClick={assignInstructor}>Assign</button>
      </div>
      {assignmentStatus && <p>{assignmentStatus}</p>}
      <div>
        <Link to={`${process.env.PUBLIC_URL}/admin-dashboard`}>
        Log out
        </Link>
      </div>
    </div>

  );
};

export default UserAdmin;
