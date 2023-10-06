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
from models import Students, Instructors, Courses

@app.route('/register', methods=['POST'])
def create_student():
    data = request.json
    student = Students.from_dict(data)
    students_collection = mongo.db.students
    students_collection.insert_one(student.to_dict())
    data = request.json
    print("Id: ", data.get('studentID'), " name: ", data.get('name'), " credits earned: ", data.get('creditsEarned'))
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def get_student():
    try:
        data = request.json
        studentID = data.get('studentID')
        name = data.get('name')
        
        students_collection = mongo.db.students
        student = students_collection.find_one({'studentID': studentID})

        if student:
            actual_name = student.get('name')
            if actual_name == name:
                # Authentication successful
                print(f"User '{name}' successfully logged in.")
                return jsonify({'message': 'Login successful'}), 200
            else:
                # Password does not match
                print(f"User '{studentID}' login failed due to incorrect name.")
                return jsonify({'error': 'Authentication failed'}), 401
        else:
            # User not found
            print(f"User '{studentID}' not found.")
            return jsonify({'error': 'Authentication failed'}), 401
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500



if __name__ == '__main__':
    app.run(debug=True)
