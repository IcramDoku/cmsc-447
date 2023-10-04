from flask_pymongo import ObjectId

class User:
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
        return User(
            username=data.get('username'),
            name=data.get('name'),
            password=data.get('password')
        )

class Student:
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
        return Student(
            studentID=data.get('studentID'),
            name=data.get('name'),
            creditsEarned=data.get('creditsEarned')
        )
