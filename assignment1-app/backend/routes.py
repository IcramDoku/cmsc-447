# backend/api/routes.py
from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt, bcrypt
from .models import User
from .models import Student
from flask_pymongo import ObjectId

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User.from_dict(data)
    
    existing_user = PyMongo.db.users.find_one({'username': user.username})

    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(user.password).decode('utf-8')
    user.password = hashed_password

    result = PyMongo.db.users.insert_one(user.to_dict())
    return jsonify({'message': 'User registration successful', 'userID': str(result.inserted_id)}), 201

@user_routes.route('/users/<string:userID>', methods=['GET'])
def get_user(userID):
    user = PyMongo.db.users.find_one({'_id': ObjectId(userID)})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user), 200

# You can add more routes for updating and deleting users as needed

student_routes = Blueprint('student_routes', __name__)

@student_routes.route('/students', methods=['GET'])
def get_students():
    students = PyMongo.db.Student.find()
    return jsonify([student.to_dict() for student in students]), 200

@student_routes.route('/students', methods=['POST'])
def create_student():
    data = request.json
    student = Student.from_dict(data)
    result = PyMongo.db.Student.insert_one(student.to_dict())
    return jsonify({'message': 'Student created successfully', 'studentID': str(result.inserted_id)}), 201

@student_routes.route('/students/<string:studentID>', methods=['GET'])
def get_student(studentID):
    student = PyMongo.db.Student.find_one({'studentID': studentID})
    if not student:
        return jsonify({'message': 'Student not found'}), 404
    return jsonify(student.to_dict()), 200

@student_routes.route('/students/<string:studentID>', methods=['PUT'])
def update_student(studentID):
    data = request.json
    updated_student = Student.from_dict(data)
    result = PyMongo.db.Student.update_one({'studentID': studentID}, {'$set': updated_student.to_dict()})
    if result.modified_count == 0:
        return jsonify({'message': 'Student not found'}), 404
    return jsonify({'message': 'Student updated successfully'}), 200

@student_routes.route('/students/<string:studentID>', methods=['DELETE'])
def delete_student(studentID):
    result = PyMongo.db.Student.delete_one({'studentID': studentID})
    if result.deleted_count == 0:
        return jsonify({'message': 'Student not found'}), 404
    return jsonify({'message': 'Student deleted successfully'}), 200
