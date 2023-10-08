from flask_pymongo import ObjectId

class Students:
    def __init__(self, studentID, name, creditsEarned, enrolledCourses=None):
        self.studentID = studentID
        self.name = name
        self.creditsEarned = creditsEarned
        self.enrolledCourses = enrolledCourses or []
        
    def to_dict(self):
        return {
            'studentID': self.studentID,
            'name': self.name,
            'creditsEarned': self.creditsEarned,
            'enrolledCourses': self.enrolledCourses,
        }

    @staticmethod
    def from_dict(data):
        return Students(
            studentID=data.get('studentID'),
            name=data.get('name'),
            creditsEarned=data.get('creditsEarned'),
            enrolledCourses=data.get('enrolledCourses', [])
        )
        
class Instructors:
    def __init__(self, instructorID, name, department):
        self.instructorID = instructorID
        self.name = name
        self.department = department

    def to_dict(self):
        return {
            'instructorID': self.instructorID,
            'name': self.name,
            'department': self.department
        }

    @staticmethod
    def from_dict(data):
        return Instructors(
            instructorID=data.get('instructorID'),
            name=data.get('name'),
            department=data.get('department')
        )
        
class Courses:
    def __init__(self, courseID, courseTitle, instructorID, instructor_name=None, instructor_department=None, enrolledStudents=None):
        self.courseID = courseID
        self.courseTitle = courseTitle
        self.instructorID = instructorID
        self.instructor_name = instructor_name
        self.instructor_department = instructor_department
        self.enrolledStudents = enrolledStudents or []

    def to_dict(self):
        return {
            'courseID': self.courseID,
            'courseTitle': self.courseTitle,
            'instructorID': self.instructorID,
            'instructor_name': self.instructor_name,
            'instructor_department': self.instructor_department,
            'enrolledStudents': self.enrolledStudents
        }

    @staticmethod
    def from_dict(data):
        return Courses(
            courseID=data.get('courseID'),
            courseTitle=data.get('courseTitle'),
            instructorID=data.get('instructorID'),
            instructor_name=data.get('instructor_name'),  
            instructor_department=data.get('instructor_department'),
            enrolledStudents=data.get('enrolledStudents', [])
        )
        





