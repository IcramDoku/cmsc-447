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
    studentID = data.get('studentID')
    
    students_collection = mongo.db.students
    studentIN = students_collection.find_one({'studentID': studentID})
    if not studentID or not data.get('name'):
        print("Either 'studentID' or 'name' is missing or empty.")
        return jsonify({'error': 'missing or empty fields'}), 400
    elif studentIN:
        print(f"User '{studentID}' already exists.")
        return jsonify({'error': 'already exists'}), 500
    else:
        student = Students.from_dict(data)
        students_collection = mongo.db.students
        students_collection.insert_one(student.to_dict())
        data = request.json
        print("Id: ", data.get('studentID'), " name: ", data.get('name'), " credits earned: ", data.get('creditsEarned'))
        return jsonify({'message': 'User created successfully'}), 200

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
    
# GET request to fetch all instructors
@app.route('/instructors', methods=['GET'])
def get_instructors():
    instructors_collection = mongo.db.instructors
    instructors = instructors_collection.find()
    instructor_list = [Instructors.from_dict(instructor) for instructor in instructors]
    return jsonify([instructor.to_dict() for instructor in instructor_list])

# POST request to create a new instructor
@app.route('/instructors', methods=['POST'])
def create_instructor():
    data = request.get_json()
    new_instructor = Instructors.from_dict(data)
    
    instructors_collection = mongo.db.instructors
    result = instructors_collection.insert_one(new_instructor.to_dict())
    
    return jsonify(str(result.inserted_id)), 201

# DELETE request to delete a single instructor by ID
@app.route('/instructors/<string:instructor_id>', methods=['DELETE'])
def delete_instructor(instructor_id):
    instructors_collection = mongo.db.instructors

    # Delete the instructor by ID
    result = instructors_collection.delete_one({"instructorID": instructor_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Instructor deleted successfully"}), 200
    else:
        return jsonify({"message": "Instructor not found or already deleted"}), 404



# GET request to fetch all courses
@app.route('/courses', methods=['GET'])
def get_courses():
    courses_collection = mongo.db.courses
    courses = courses_collection.find()
    course_list = [Courses.from_dict(course) for course in courses]
    return jsonify([course.to_dict() for course in course_list])

# POST request to create a new course
@app.route('/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    new_course = Courses.from_dict(data)
    
    courses_collection = mongo.db.courses
    result = courses_collection.insert_one(new_course.to_dict())
    
    return jsonify(str(result.inserted_id)), 201

# DELETE request to delete a specific course by ID
@app.route('/courses/<string:course_id>', methods=['DELETE'])
def delete_course_by_id(course_id):
    courses_collection = mongo.db.courses

    # Delete the course with the specified ID from the collection
    result = courses_collection.delete_one({"courseID": course_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Course deleted successfully"}), 200
    else:
        return jsonify({"message": "Course not found"}), 404
    
    
    
    


@app.route('/assign', methods=['POST'])
def assign_instructor():
    data = request.json
    courseID = data.get('courseID')
    instructorID = data.get('instructorID')

    if not courseID or not instructorID:
        return jsonify({'error': 'Missing courseID or instructorID'}), 400

    try:
        # Get a reference to the 'courses' collection using PyMongo
        courses_collection = mongo.db.courses

        # Find the course document using its 'courseID'
        course = courses_collection.find_one({'courseID': courseID})

        if course is None:
            return jsonify({'error': 'Course not found'}), 404

        # Update the 'instructorID' field of the course
        course['instructorID'] = instructorID

        # Update the course document in the 'courses' collection
        courses_collection.update_one({'_id': course['_id']}, {'$set': course})

        return jsonify({'message': 'Instructor assigned to course successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
