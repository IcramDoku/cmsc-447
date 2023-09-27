from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId  # Import ObjectId from bson module
"""THIS Connection is valid:
->Run Python File
The schema does not need to be setup, the program will create it if it does not exist already
defining the database is important tho
Tested with:
C:\Users\icram>curl --X POST -H "Content-Type: application/json" --data-binary "{\"_id\": \"cat\", \"username\": \"john_doe\", \"name\": \"John Doe\", \"password\": \"password123\"}" http://127.0.0.1:5000/users
curl: (6) Could not resolve host: POST
{
  "message": "User created successfully"
}

C:\Users\icram>curl http://127.0.0.1:5000/users
[]
"""

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://mongo:BhYSvmZJmN1ERVgO@cmsc447.ymkauhy.mongodb.net/test'
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
    # Debugging: Print the data before jsonify
    for user in users:
        print(user)
    
    # Convert ObjectId to strings for JSON serialization
    user_list = [{'_id': str(user['_id']), 'username': user['username'], 'name': user['name'], 'password': user['password']} for user in users]
    
    return jsonify(user_list), 200

@app.route('/students', methods=['GET'])
def get_students():
    students_collection = mongo.db.students
    students = students_collection.find()
    student_list = [student for student in students]
    return jsonify(student_list), 200

if __name__ == '__main__':
    app.run(debug=True)
