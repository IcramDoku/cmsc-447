const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { Students, Instructors, Courses } = require('./models');
const getConnection = require("./config/db");
const dotEnv = require("dotenv");
const app = express();

const port = process.env.PORT || 4000;

// Registering middlewares
dotEnv.config(); // Config with environment setup
app.use(express.json()); // For formatting
app.use(cors()); // Needs cors to connect to the frontend!!!

let db; // Declare db variable

// Connect to MongoDB
getConnection().then((database) => {
  db = database;

  // Print this out on the first window
  app.get('/', (req, res) => {
    res.send('Hello from Express!');
  });

  // Define a route to create a new student
  app.post('/register', async (req, res) => {
    try {
      const data = req.body;
      console.log("data passed: ",data);
      const studentID = data.studentID;
      console.log(studentID)

      // Access the 'students' collection in the MongoDB database
      const studentsCollection = db.collection('students');
      const studentIN = await studentsCollection.findOne({ studentID: studentID });
      console.log(studentIN)
      // Check for missing or empty fields
      if (!studentID || !data.name) {
        console.log("Either 'studentID' or 'name' is missing or empty.");
        return res.status(400).json({ error: 'missing or empty fields' });
      } else if (studentIN) {
        console.log(`User '${studentID}' already exists.`);
        return res.status(500).json({ error: 'already exists' });
      } else {
        const student = Students.from_dict(data);
        await studentsCollection.insertOne(student.to_dict());
        console.log(`Id: ${data.studentID}, name: ${data.name}, credits earned: ${data.creditsEarned}`);
        return res.status(200).json({ message: 'User created successfully' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: `An error occurred: ${error}` });
    }
  });

  // Define a route to log in a student
  app.post('/login', async (req, res) => {
    try {
      const data = req.body;
      const studentID = data.studentID;
      console.log(studentID)
      const name = data.name;

      const studentsCollection = db.collection('students');
      const student = await studentsCollection.findOne({ studentID: studentID });
      console.log(student)
      if (student) {
        const actual_name = student.name;
        if (actual_name === name) {
          // Authentication successful
          console.log(`User '${name}' successfully logged in.`);
          return res.status(200).json({ message: 'Login successful' });
        } else {
          // Password does not match
          console.log(`User '${studentID}' login failed due to incorrect name.`);
          return res.status(401).json({ error: 'Authentication failed' });
        }
      } else {
        // User not found
        console.log(`User '${studentID}' not found.`);
        return res.status(401).json({ error: 'Authentication failed' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to get the credits earned by a student
  app.get('/credits-earned/:studentID', async (req, res) => {
    const studentID = req.params.studentID;
    const student = await db.collection('students').findOne({ studentID: studentID });

    if (student) {
      const creditsEarned = student.creditsEarned;
      res.json({ studentID: studentID, creditsEarned: creditsEarned });
    } else {
      res.json({ message: 'Student not found' });
    }
  });

  // Define a route to fetch all instructors
  app.get('/instructors', async (req, res) => {
    try {
      // Access the 'instructors' collection in the MongoDB database
      const instructorsCollection = db.collection('instructors');
      const instructors = await instructorsCollection.find().toArray();

      // Create a list of instructor objects using from_dict()
      const instructorList = instructors.map((instructor) => Instructors.from_dict(instructor));

      // Return the instructor list as JSON
      res.json(instructorList.map((instructor) => instructor.to_dict()));
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to log in an instructor
  app.post('/instructor-login', async (req, res) => {
    try {
      const data = req.body;
      const instructorID = data.instructorID;
      const name = data.name;

      // Access the 'instructors' collection in the MongoDB database
      const instructorsCollection = db.collection('instructors');
      const instructor = await instructorsCollection.findOne({ instructorID: instructorID });

      if (instructor) {
        const actualName = instructor.name;
        if (actualName === name) {
          // Authentication successful
          console.log(`User '${name}' successfully logged in.`);
          res.json({ message: 'Login successful' });
        } else {
          // Password does not match
          console.log(`User '${instructorID}' login failed due to incorrect name.`);
          res.status(401).json({ error: 'Authentication failed' });
        }
      } else {
        // Instructor not found
        console.log(`User '${instructorID}' not found.`);
        res.status(401).json({ error: 'Authentication failed' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to create a new instructor
  app.post('/instructors', async (req, res) => {
    try {
      const data = req.body;
      const newInstructor = Instructors.from_dict(data);

      // Access the 'instructors' collection in the MongoDB database
      const instructorsCollection = db.collection('instructors');
      const result = await instructorsCollection.insertOne(newInstructor.to_dict());

      // Return the inserted instructor's ID as a response
      res.status(201).json({ instructorID: result.insertedId });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to delete a single instructor by ID
  app.delete('/instructors/:instructor_id', async (req, res) => {
    try {
      const instructorID = req.params.instructor_id;

      // Access the 'instructors' collection in the MongoDB database
      const instructorsCollection = db.collection('instructors');
      
      // Delete the instructor by ID
      const result = await instructorsCollection.deleteOne({ instructorID: instructorID });

      if (result.deletedCount > 0) {
        res.json({ message: 'Instructor deleted successfully' });
      } else {
        res.status(404).json({ message: 'Instructor not found or already deleted' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to get courses taught by an instructor
  app.get('/instructor/courses/:instructor_id', async (req, res) => {
    try {
      const instructorID = req.params.instructor_id;
      const coursesCollection = db.collection('courses');
      const studentsCollection = db.collection('students');

      // Retrieve course information
      const course = await coursesCollection.findOne({ instructorID: instructorID });

      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const courseTitle = course.courseTitle;
      const courseID = course.courseID;

      const enrolledStudents = course.enrolledStudents || [];
      const studentsInfo = [];

      for (const studentID of enrolledStudents) {
        const student = await studentsCollection.findOne({ studentID: studentID });

        if (student) {
          let courseGrade = [];

          // Check if the student has a grades dictionary
          if ('grades' in student) {
            const grades = student.grades;

            // Check if the course_id exists in the grades dictionary
            if (courseID in grades) {
              courseGrade = grades[courseID];
            }
          }

          const studentName = student.name;
          const studentInfo = {
            studentID: studentID,
            studentName: studentName,
            courseTitle: courseTitle,
            courseID: courseID,
            grade: courseGrade
          };

          studentsInfo.push(studentInfo);
        }
      }

      res.json({
        enrolled_students: studentsInfo
      });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to get a student's grade for a specific course
  app.get('/student/grade/:student_id/:course_id', async (req, res) => {
    try {
      const studentID = req.params.student_id;
      const courseID = req.params.course_id;

      const studentsCollection = db.collection('students');

      // Find the student based on the provided student_id
      const student = await studentsCollection.findOne({ studentID: studentID });

      if (student) {
        // Check if the student has a grades dictionary
        if ('grades' in student) {
          const grades = student.grades;

          // Check if the course_id exists in the grades dictionary
          if (courseID in grades) {
            const courseGrade = grades[courseID];
            res.json({ studentID: studentID, courseID: courseID, grade: courseGrade });
          } else {
            res.json({ message: `Grade for course ${courseID} not found for student ${studentID}` });
          }
        } else {
          res.json({ message: 'Grades not found for the student' });
        }
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to add a grade to a student's record
  app.post('/add_grade/:instructor_id/:student_id', async (req, res) => {
    try {
      const instructorID = req.params.instructor_id;
      const studentID = req.params.student_id;

      const coursesCollection = db.collection('courses');

      // Retrieve course information
      const course = await coursesCollection.findOne({ instructorID: instructorID });

      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const data = req.body;
      const grade = data.grade;

      if (grade === undefined) {
        res.json({ error: 'Grade is required' });
        return;
      }

      const studentsCollection = db.collection('students');

      // Check if the student is enrolled in the course
      if (course.enrolledStudents.includes(studentID)) {
        const student = await studentsCollection.findOne({ studentID: studentID });

        if (student) {
          // Check if the student has a grades dictionary, create one if not
          if (!('grades' in student)) {
            student.grades = {};
          }

          student.grades[course.courseID] = grade;

          await studentsCollection.updateOne(
            { studentID: studentID },
            { $set: { grades: student.grades } }
          );

          const updatedStudent = {
            studentID: studentID,
            grades: student.grades
          };

          res.json({ message: 'Grade added successfully', updated_student: updatedStudent });
        } else {
          res.status(404).json({ error: 'Student not found' });
        }
      } else {
        res.status(400).json({ error: 'Student is not enrolled in the course' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to get the department of an instructor
  app.get('/department/:instructorID', async (req, res) => {
    try {
      const instructorID = req.params.instructorID;

      const instructorsCollection = db.collection('instructors');

      // Find the instructor based on the provided instructorID
      const instructor = await instructorsCollection.findOne({ instructorID: instructorID });

      if (instructor) {
        const department = instructor.department;
        res.json({ instructorID: instructorID, department: department });
      } else {
        res.json({ message: 'Instructor not found' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to fetch all courses
  app.get('/courses', async (req, res) => {
    try {
      const coursesCollection = db.collection('courses');

      // Retrieve all courses from the collection
      const courses = await coursesCollection.find().toArray();

      // Create a list of course objects using from_dict()
      const courseList = courses.map(course => Courses.from_dict(course));

      // Return the list of courses as JSON
      res.json(courseList.map(course => course.to_dict()));
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to create a new course
  app.post('/courses', async (req, res) => {
    try {
      const data = req.body;
      const newCourse = Courses.from_dict(data);

      const coursesCollection = db.collection('courses');

      // Insert the new course into the collection
      const result = await coursesCollection.insertOne(newCourse.to_dict());

      // Return the inserted course's ID as a response
      res.json({ message: 'Course created successfully', courseID: result.insertedId });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to delete a specific course by ID
  app.delete('/courses/:course_id', async (req, res) => {
    try {
      const courseID = req.params.course_id;

      const coursesCollection = db.collection('courses');

      // Delete the course with the specified ID from the collection
      const result = await coursesCollection.deleteOne({ courseID: courseID });

      if (result.deletedCount > 0) {
        res.json({ message: 'Course deleted successfully' });
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to assign an instructor to a course
  app.post('/assign', async (req, res) => {
    try {
      const data = req.body;
      const courseID = data.courseID;
      const instructorID = data.instructorID;

      if (!courseID || !instructorID) {
        return res.status(400).json({ error: 'Missing courseID or instructorID' });
      }

      // Get a reference to the 'courses' collection
      const coursesCollection = db.collection('courses');

      // Find the course document using its 'courseID'
      const course = await coursesCollection.findOne({ courseID: courseID });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Update the 'instructorID' field of the course
      await coursesCollection.updateOne({ _id: course._id }, { $set: { instructorID: instructorID } });

      return res.status(201).json({ message: 'Instructor assigned to course successfully' });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to view courses with instructor information
  app.get('/view-courses', async (req, res) => {
    try {
      const coursesCollection = db.collection('courses');
      const allCourses = await coursesCollection.find().toArray();

      // Initialize a list to store course data including instructor information
      const coursesData = [];

      for (const course of allCourses) {
        const courseData = Courses.from_dict(course);
        const instructorID = courseData.instructorID;

        // Fetch instructor information based on instructorID
        if (instructorID) {
          const instructorsCollection = db.collection('instructors');
          const instructor = await instructorsCollection.findOne({ instructorID: instructorID });

          if (instructor) {
            const instructorData = Instructors.from_dict(instructor);
            courseData.instructor_name = instructorData.name;
            courseData.instructor_department = instructorData.department;
          }
        }

        coursesData.push(courseData);
      }

      // Convert the list of course data to dictionaries and return as JSON
      const coursesJson = coursesData.map(course => course.to_dict());
      res.json(coursesJson);
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to enroll a student in a course
  app.post('/enrollment', async (req, res) => {
    try {
      const data = req.body;
      const studentID = data.studentID;
      const courseID = data.courseID;

      // Check if the student and course exist in the database
      const student = await db.collection('students').findOne({ studentID: studentID });
      const course = await db.collection('courses').findOne({ courseID: courseID });

      if (student && course) {
        const enrolledCourses = student.enrolledCourses || [];
        const enrolledStudents = course.enrolledStudents || [];

        if (!enrolledCourses.includes(courseID) && !enrolledStudents.includes(studentID)) {
          // Add the course ID to the student's enrolled courses
          enrolledCourses.push(courseID);
          await db.collection('students').updateOne({ studentID: studentID }, { $set: { enrolledCourses: enrolledCourses } });

          // Add the student ID to the course's enrolled students
          enrolledStudents.push(studentID);
          await db.collection('courses').updateOne({ courseID: courseID }, { $set: { enrolledStudents: enrolledStudents } });

          // Increment the creditsEarned for the student by 3
          const currentCreditsEarned = parseInt(student.creditsEarned || 0);
          const newCreditsEarned = currentCreditsEarned + 3;

          await db.collection('students').updateOne({ studentID: studentID }, { $set: { creditsEarned: newCreditsEarned } });


          return res.json({ message: 'Enrollment successful' });
        } else {
          return res.json({ message: 'Student is already enrolled in this course' });
        }
      } else {
        return res.json({ message: 'Student or course not found' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to get courses enrolled by a student
  app.get('/student-courses/:studentID', async (req, res) => {
    try {
      const studentID = req.params.studentID;

      // Find the student based on the provided studentID
      const student = await db.collection('students').findOne({ studentID: studentID });

      if (student) {
        // Retrieve the list of course IDs enrolled by the student
        const enrolledCourses = student.enrolledCourses || [];

        // Initialize a list to store course data
        const coursesData = [];

        for (const courseID of enrolledCourses) {
          // Fetch the course data based on courseID
          const course = await db.collection('courses').findOne({ courseID: courseID });

          if (course) {
            // Convert the Courses object to a dictionary
            const courseData = Courses.from_dict(course).to_dict();

            // Fetch instructor information based on instructorID
            const instructorID = courseData.instructorID;
            if (instructorID) {
              const instructor = await db.collection('instructors').findOne({ instructorID: instructorID });

              if (instructor) {
                const instructorData = Instructors.from_dict(instructor);
                courseData.instructor_name = instructorData.name;
                courseData.instructor_department = instructorData.department;
              }
            }

            coursesData.push(courseData);
          }
        }

        // Convert the list of course data to JSON
        return res.json(coursesData);
      } else {
        return res.json({ message: 'Student not found' });
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Define a route to remove a course from a student's enrollment
  app.delete('/student-courses/:studentID/remove/:courseID', async (req, res) => {
    try {
      const studentID = req.params.studentID;
      const courseID = req.params.courseID;

      // Check if the student exists in the database
      const student = await db.collection('students').findOne({ studentID: studentID });

      if (student) {
        // Check if the student has a grades dictionary
        if (student.grades) {
          const grades = student.grades;

          // Check if the courseID exists in the grades dictionary
          if (grades[courseID]) {
            // Remove the courseID:grade pair from the grades dictionary
            delete grades[courseID];
            await db.collection('students').updateOne({ studentID: studentID }, { $set: { grades: grades } });
          }
        }

        const enrolledCourses = student.enrolledCourses || [];

        if (enrolledCourses.includes(courseID)) {
          // Remove the course ID from the student's enrolled courses
          enrolledCourses.splice(enrolledCourses.indexOf(courseID), 1);
          await db.collection('students').updateOne({ studentID: studentID }, { $set: { enrolledCourses: enrolledCourses } });

          // Remove the student ID from the course's enrolled students
          await db.collection('courses').updateOne({ courseID: courseID }, { $pull: { enrolledStudents: studentID } });

          // Decrement the creditsEarned for the student by 3, never goes below 0 though
          const currentCreditsEarned = student.creditsEarned || 0;
          const newCreditsEarned = Math.max(currentCreditsEarned - 3, 0);
          await db.collection('students').updateOne({ studentID: studentID }, { $set: { creditsEarned: newCreditsEarned } });

          return res.json({ message: 'Course removed successfully' });
        }
      }

      return res.status(404).json({ message: 'Student or course not found' });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Start the server only after successfully connecting to MongoDB
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error(`Failed to connect to MongoDB. Error: ${error}`);
  process.exit(1); // Exit the application if MongoDB connection fails
});

