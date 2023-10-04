from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId  # Import ObjectId from bson module
from flask_cors import CORS

app = Flask(__name__)

# Initialize CORS with your app
CORS(app)

app.config['MONGO_URI'] = 'mongodb+srv://Icram:1234@cluster0.q35cw2y.mongodb.net/database'
mongo = PyMongo(app)

# Import your User and Student classes from models.py
from models import User, Student

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User.from_dict(data)
    users_collection = mongo.db.users
    users_collection.insert_one(user.to_dict())
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/students', methods=['POST'])
def create_student():
    data = request.json
    student = Student.from_dict(data)
    students_collection = mongo.db.students
    students_collection.insert_one(student.to_dict())
    return jsonify({'message': 'Student created successfully'}), 201

@app.route('/users', methods=['GET'])
def get_users():
    users_collection = mongo.db.users
    users = users_collection.find()
    
    # Convert ObjectId to strings for JSON serialization
    user_list = [{'_id': str(user['_id']), 'username': user['username'], 'name': user['name'], 'password': user['password']} for user in users]

    for user in users:
        print(user)
        
    return jsonify(user_list), 200

@app.route('/students', methods=['GET'])
def get_students():
    students_collection = mongo.db.students
    students = students_collection.find()
    
    student_list = [{'_id': str(student['_id']), 'studentID': student['studentID'], 'name': student['name'], 'creditsEarned': student['creditsEarned']} for student in students]
    
    for student in students:
        print(student)
        
    return jsonify(student_list), 200

if __name__ == '__main__':
    app.run(debug=True)
