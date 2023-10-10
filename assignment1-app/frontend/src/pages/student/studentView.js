import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API requests

function StudentView() {
  const location = useLocation();
  const { studentID, name } = location.state || {};
  const [creditsEarned, setCreditsEarned] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const API_URL = 'http://127.0.0.1:5000'; 

  useEffect(() => {
    axios.get(`${API_URL}/view-courses`)
      .then((response) => {
        console.log("API courses:", response.data);
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
    axios.get(`${API_URL}/student-courses/${studentID}`)
      .then((response) => {
        console.log("API Student Courses:", response.data);
        const enrolledCourses = response.data;
    
        // To store all courseID values in an array
        const courseIDs = enrolledCourses.map(course => course.courseID);
        console.log("Course IDs:", courseIDs);
    
        // Fetch the grade for each course and add it to the course data
        const coursePromises = courseIDs.map(courseID => {
          return axios.get(`${API_URL}/student/grade/${studentID}/${courseID}`)
            .then((gradeResponse) => {
              const course = enrolledCourses.find(course => course.courseID === courseID);
              if (gradeResponse.data.grade !== undefined) {
                // If grade is found, add it to the course data
                course.grade = gradeResponse.data.grade;
              } else {
                // Handle the case where grade is not found
                console.error(`Grade not found for course ${courseID}`);
              }
            })
            .catch((error) => {
              console.error(`Error fetching grade for course ${courseID}:`, error);
            });
        });
    
        // Wait for all grade fetch requests to complete
        Promise.all(coursePromises)
          .then(() => {
            // After all grades are fetched and added to the course data, you can set the state
            setEnrolledCourses(enrolledCourses);
          });
      })
      .catch((error) => {
        console.error('Error fetching enrolled courses:', error);
      });
    axios.get(`${API_URL}/credits-earned/${studentID}`)
      .then((response) => {
        console.log("API Credits Earned:", response.data);
        setCreditsEarned(response.data.creditsEarned);
      })
      .catch((error) => {
        console.error('Error fetching credits earned:', error);
      });

  }, [studentID]);

  const handleEnrollment = async (courseID) => {
    try {
      // Make an API request to enroll the student in the course
      const response = await axios.post(`${API_URL}/enrollment`, {
        studentID,
        courseID,
      });
  
      if (response.status === 200) {
        // Check if the enrollment was successful
        if (response.data.message === 'Enrollment successful') {
          // Update the state to reflect the new enrollment status
          setCourses((prevCourses) =>
            prevCourses.map((course) =>
              course.courseID === courseID ? { ...course, status: 'Enrolled' } : course
            )
          );
  
          // Fetch the enrolled courses for the student and update the state
          axios.get(`${API_URL}/student-courses/${studentID}`)
            .then((response) => {
              console.log("API Student Courses:", response.data);
              const enrolledCourses = response.data;
          
              // To store all courseID values in an array
              const courseIDs = enrolledCourses.map(course => course.courseID);
              console.log("Course IDs:", courseIDs);
          
              // Fetch the grade for each course and add it to the course data
              const coursePromises = courseIDs.map(courseID => {
                return axios.get(`${API_URL}/student/grade/${studentID}/${courseID}`)
                  .then((gradeResponse) => {
                    const course = enrolledCourses.find(course => course.courseID === courseID);
                    if (gradeResponse.data.grade !== undefined) {
                      // If grade is found, add it to the course data
                      course.grade = gradeResponse.data.grade;
                    } else {
                      // Handle the case where grade is not found
                      console.error(`Grade not found for course ${courseID}`);
                    }
                  })
                  .catch((error) => {
                    console.error(`Error fetching grade for course ${courseID}:`, error);
                  });
              });
          
              // Wait for all grade fetch requests to complete
              Promise.all(coursePromises)
                .then(() => {
                  // After all grades are fetched and added to the course data, you can set the state
                  setEnrolledCourses(enrolledCourses);
                });
            })
            .catch((error) => {
              console.error('Error fetching enrolled courses:', error);
            });
            // Re-render to user
            axios.get(`${API_URL}/credits-earned/${studentID}`)
              .then((response) => {
                console.log("API Credits Earned:", response.data);
                setCreditsEarned(response.data.creditsEarned);
              })
              .catch((error) => {
                console.error('Error fetching credits earned:', error);
              });
              
        } else {
          console.error('Enrollment failed:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error with enrollment:', error);
    }
  };
  

  const handleRemoveSingleCourse = async (courseID) => {
    try {
      // Make a DELETE request to remove the course for the student
      const response = await axios.delete(`${API_URL}/student-courses/${studentID}/remove/${courseID}`);

      if (response.status === 200) {
        // Update the state to remove the course from enrolledCourses
        setEnrolledCourses((prevEnrolledCourses) =>
          prevEnrolledCourses.filter((course) => course.courseID !== courseID)
        );
        // Re-render to user
        axios.get(`${API_URL}/credits-earned/${studentID}`)
        .then((response) => {
          console.log("API Credits Earned:", response.data);
          setCreditsEarned(response.data.creditsEarned);
        })
        .catch((error) => {
          console.error('Error fetching credits earned:', error);
        });
      }
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };
  
  

  return (
    <div>
      <div>
        <h1>Student Schedule and Registration</h1>
        {studentID && <p>Student ID: {studentID}</p>}
        {name && <p>Name: {name}</p>}
        {creditsEarned && <p>Credits Earned: {creditsEarned}</p>}
        {/* Your student view content here */}
      </div>
      <h1>Hello, {name}!</h1>
      <table>
        {/* Render 'My Courses' section only if there are enrolled courses */}
        {enrolledCourses.length > 0 && (
          <thead>
            <tr>
              <th>
                <h2>My Courses:</h2>
              </th>
            </tr>
          </thead>
        )}
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Instructor</th>
            <th>Department</th>
            <th>Credits Hours</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {enrolledCourses.map((course) => (
            <tr key={course.courseID}>
              <td>{course.courseTitle}</td>
              <td>{course.instructor_name}{/* You need to fetch and display the instructor's name here */}</td>
              <td>{course.instructor_department}{/* You need to fetch and display the instructor's department here */}</td>
              <td>3</td> {/* # of credits*/}
              <td>{course.grade}</td>
              <button onClick={() => handleRemoveSingleCourse(course.courseID)}>Drop</button>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Your Choice Of Courses:</h2>
        <table>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Instructor</th>
              <th>Department</th>
              <th>Credits Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseID}>
                <td>{course.courseTitle}</td>
                <td>{course.instructor_name}{/* You need to fetch and display the instructor's name here */}</td>
                <td>{course.instructor_department}{/* You need to fetch and display the instructor's department here */}</td>
                <td>3</td> {/* Assuming credit hours is always 3 */}
                <td>
                  <button onClick={() => handleEnrollment(course.courseID)}>
                    {'Enroll'}
                  </button>
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

export default StudentView;


