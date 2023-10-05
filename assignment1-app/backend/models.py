from flask_pymongo import ObjectId

class Users:
    def __init__( self, username, name, password):
        self.username = username
        self.name = name
        self.password = password

    def to_dict(self):
        return {
            'username': self.username,
            'name': self.name,
            'password': self.password
        }

    @staticmethod
    def from_dict(data):
        return Users(
            username=data.get('username'),
            name=data.get('name'),
            password=data.get('password')
        )

class Students:
    def __init__(self, studentID, name, creditsEarned):
        self.studentID = studentID
        self.name = name
        self.creditsEarned = creditsEarned

    def to_dict(self):
        return {
            'studentID': self.studentID,
            'name': self.name,
            'creditsEarned': self.creditsEarned
        }

    @staticmethod
    def from_dict(data):
        return Students(
            studentID=data.get('studentID'),
            name=data.get('name'),
            creditsEarned=data.get('creditsEarned')
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
    def __init__(self, courseID, courseTitle, instructorID):
        self.courseID = courseID
        self.courseTitle = courseTitle
        self.instructorID = instructorID

    def to_dict(self):
        return {
            'courseID': self.courseID,
            'courseTitle': self.courseTitle,
            'instructorID': self.instructorID
        }

    @staticmethod
    def from_dict(data):
        return Courses(
            courseID=data.get('courseID'),
            courseTitle=data.get('courseTitle'),
            instructorID=data.get('instructorID')
        )
