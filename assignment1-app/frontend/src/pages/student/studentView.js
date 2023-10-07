import React, { useState } from 'react';

const StudentView = ({ name }) => {
  // Sample course data
  const initialCourses = [
    { id: 1, name: 'Mathematics', status: 'Not Enrolled' },
    { id: 2, name: 'History', status: 'Not Enrolled' },
    { id: 3, name: 'Science', status: 'Not Enrolled' },
    { id: 4, name: 'Literature', status: 'Not Enrolled' },
  ];

  const [courses, setCourses] = useState(initialCourses);

  // Function to toggle the enrollment status of a course
  const toggleEnrollment = (id) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id
          ? {
              ...course,
              status: course.status === 'Enrolled' ? 'Not Enrolled' : 'Enrolled',
            }
          : course
      )
    );
  };

  // Filter enrolled courses
  const enrolledCourses = courses.filter((course) => course.status === 'Enrolled');

  return (
    <div>
      <h1>Hello, {name}</h1>
      <table>
        {/* Render 'My Courses' section only if there are enrolled courses */}
        {enrolledCourses.length > 0 && (
          <thead>
            <tr>
              <th><h2>My Courses:</h2></th>
            </tr>
          </thead>
        )}
        <tbody>
          {enrolledCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <th>Instructor</th>
              <th>Department</th>
              <th>Grade</th>
              <th>Credits Hours</th>
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
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{}</td>
              <td>{}</td>
              <td>{}</td>
              <td>{course.status}</td>
              <td>
                <button onClick={() => toggleEnrollment(course.id)}>
                  {course.status === 'Enrolled' ? 'Drop' : 'Enroll'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentView;

