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
from models import Users, Students

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = Users.from_dict(data)
    users_collection = mongo.db.users
    users_collection.insert_one(user.to_dict())
    data = request.json
    print("usr: ", data.get('username'), " pwd: ", data.get('password'))
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/signin', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        users_collection = mongo.db.users
        user = users_collection.find_one({'username': username})

        if user:
            stored_password = user.get('password')
            if stored_password == password:
                # Authentication successful
                print(f"User '{username}' successfully logged in.")
                return jsonify({'message': 'Login successful'}), 200
            else:
                # Password does not match
                print(f"User '{username}' login failed due to incorrect password.")
                return jsonify({'error': 'Authentication failed'}), 401
        else:
            # User not found
            print(f"User '{username}' not found.")
            return jsonify({'error': 'Authentication failed'}), 401
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/students', methods=['POST'])
def create_student():
    data = request.json
    student = Students.from_dict(data)
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
