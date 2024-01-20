class Students {
    constructor(studentID, name, creditsEarned, enrolledCourses = []) {
      this.studentID = studentID;
      this.name = name;
      this.creditsEarned = creditsEarned;
      this.enrolledCourses = enrolledCourses;
    }
  
    to_dict() {
      return {
        'studentID': this.studentID,
        'name': this.name,
        'creditsEarned': this.creditsEarned,
        'enrolledCourses': this.enrolledCourses,
      };
    }
  
    static from_dict(data) {
      return new Students(
        data.studentID,
        data.name,
        data.creditsEarned,
        data.enrolledCourses || []
      );
    }
  }
  
  class Instructors {
    constructor(instructorID, name, department) {
      this.instructorID = instructorID;
      this.name = name;
      this.department = department;
    }
  
    to_dict() {
      return {
        'instructorID': this.instructorID,
        'name': this.name,
        'department': this.department,
      };
    }
  
    static from_dict(data) {
      return new Instructors(
        data.instructorID,
        data.name,
        data.department
      );
    }
  }
  
  class Courses {
    constructor(courseID, courseTitle, instructorID, instructor_name = null, instructor_department = null, enrolledStudents = []) {
      this.courseID = courseID;
      this.courseTitle = courseTitle;
      this.instructorID = instructorID;
      this.instructor_name = instructor_name;
      this.instructor_department = instructor_department;
      this.enrolledStudents = enrolledStudents;
    }
  
    to_dict() {
      return {
        'courseID': this.courseID,
        'courseTitle': this.courseTitle,
        'instructorID': this.instructorID,
        'instructor_name': this.instructor_name,
        'instructor_department': this.instructor_department,
        'enrolledStudents': this.enrolledStudents,
      };
    }
  
    static from_dict(data) {
      return new Courses(
        data.courseID,
        data.courseTitle,
        data.instructorID,
        data.instructor_name,
        data.instructor_department,
        data.enrolledStudents || []
      );
    }
  }
  
  module.exports = { Students, Instructors, Courses };
  