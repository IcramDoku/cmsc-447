# Import the required modules and create a Flask app
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)

# Initialize CORS with the Flask app to handle Sharing
CORS(app)

# Configure the MongoDB URI and create a PyMongo instance
app.config['MONGO_URI'] = 'mongodb+srv://Icram:1234@cluster0.q35cw2y.mongodb.net/database'
mongo = PyMongo(app)

# Import Students, Instructors, and Courses classes from models.py
from models import Students, Instructors, Courses

# Define a route to create a new student
@app.route('/register', methods=['POST'])
def create_student():
    data = request.json
    studentID = data.get('studentID')
    
    # Access the 'students' collection in the MongoDB database
    students_collection = mongo.db.students
    studentIN = students_collection.find_one({'studentID': studentID})
    
    # Check for missing or empty fields
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

# Define a route to log in a student
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

# Define a route to get the credits earned by a student
@app.route('/credits-earned/<string:studentID>', methods=['GET'])
def get_credits_earned(studentID):
    student = mongo.db.students.find_one({'studentID': studentID})

    if student:
        credits_earned = student.get('creditsEarned')
        return jsonify({'studentID': studentID, 'creditsEarned': credits_earned})
    else:
        return jsonify({'message': 'Student not found'})
    
# Define a route to fetch all instructors 
@app.route('/instructors', methods=['GET'])
def get_instructors():
    # Access the 'instructors' collection in the MongoDB database
    instructors_collection = mongo.db.instructors
    instructors = instructors_collection.find()
    
    # Create a list of instructor objects using from_dict()
    instructor_list = [Instructors.from_dict(instructor) for instructor in instructors]
    
    # Return the instructor list as JSON
    return jsonify([instructor.to_dict() for instructor in instructor_list])

# Define a route to log in an instructor 
@app.route('/instructor-login', methods=['POST'])
def get_instructor():
    try:
        data = request.json
        instructorID = data.get('instructorID')
        name = data.get('name')
        
        # Access the 'instructors' collection in the MongoDB database
        instructors_collection = mongo.db.instructors
        instructor = instructors_collection.find_one({'instructorID': instructorID})

        if instructor:
            actual_name = instructor.get('name')
            if actual_name == name:
                # Authentication successful
                print(f"User '{name}' successfully logged in.")
                return jsonify({'message': 'Login successful'}), 200
            else:
                # Password does not match
                print(f"User '{instructorID}' login failed due to incorrect name.")
                return jsonify({'error': 'Authentication failed'}), 401
        else:
            # Instructor not found
            print(f"User '{instructorID}' not found.")
            return jsonify({'error': 'Authentication failed'}), 401
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

# Define a route to create a new instructor
@app.route('/instructors', methods=['POST'])
def create_instructor():
    data = request.get_json()
    new_instructor = Instructors.from_dict(data)
    
    # Access the 'instructors' collection in the MongoDB database
    instructors_collection = mongo.db.instructors
    result = instructors_collection.insert_one(new_instructor.to_dict())
    
    # Return the inserted instructor's ID as a response
    return jsonify(str(result.inserted_id)), 201

# Define a route to delete a single instructor by ID
@app.route('/instructors/<string:instructor_id>', methods=['DELETE'])
def delete_instructor(instructor_id):
    # Access the 'instructors' collection in the MongoDB database
    instructors_collection = mongo.db.instructors

    # Delete the instructor by ID
    result = instructors_collection.delete_one({"instructorID": instructor_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Instructor deleted successfully"}), 200
    else:
        return jsonify({"message": "Instructor not found or already deleted"}), 404

# Define a route to get courses taught by an instructor
@app.route('/instructor/courses/<string:instructor_id>', methods=['GET'])
def get_courses_by_instructor(instructor_id):
    try:
        courses_collection = mongo.db.courses
        students_collection = mongo.db.students

        # Retrieve course information
        course = courses_collection.find_one({"instructorID": instructor_id})
        if not course:
            return jsonify({"error": "Course not found"}), 404

        course_title = course.get("courseTitle")
        course_id = course.get("courseID")
        
        if course:
            enrolled_students = course.get("enrolledStudents", [])
            students_info = []
            
            for student_id in enrolled_students:
                student = students_collection.find_one({"studentID": student_id})
                if student:
                    course_grade = []
                    # Check if the student has a grades dictionary
                    if 'grades' in student:
                        grades = student['grades']

                        # Check if the course_id exists in the grades dictionary
                        if course_id in grades:
                            course_grade = grades[course_id]
                    student_name = student.get("name")
                    student_info = {
                        "studentID": student_id,
                        "studentName": student_name,
                        "courseTitle": course_title,
                        "courseID": course_id,
                        "grade": course_grade
                    }
                    students_info.append(student_info)

            return jsonify({
                "enrolled_students": students_info
            })
        else:
            return jsonify({"error": "Course not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Define a route to get a student's grade for a specific course
@app.route('/student/grade/<string:student_id>/<string:course_id>', methods=['GET'])
def get_student_course_grade(student_id, course_id):
    try:
        students_collection = mongo.db.students

        # Find the student based on the provided student_id
        student = students_collection.find_one({'studentID': student_id})

        if student:
            # Check if the student has a grades dictionary
            if 'grades' in student:
                grades = student['grades']

                # Check if the course_id exists in the grades dictionary
                if course_id in grades:
                    course_grade = grades[course_id]
                    return jsonify({'studentID': student_id, 'courseID': course_id, 'grade': course_grade})
                else:
                    return jsonify({'message': f'Grade for course {course_id} not found for student {student_id}'})
            else:
                return jsonify({'message': 'Grades not found for the student'})

        else:
            return jsonify({'message': 'Student not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Define a route to add a grade to a student's record
@app.route('/add_grade/<string:instructor_id>/<string:student_id>', methods=['POST'])
def add_grade_to_student(instructor_id, student_id):
    try:
        courses_collection = mongo.db.courses

        # Retrieve course information
        course = courses_collection.find_one({"instructorID": instructor_id})
        if not course:
            return jsonify({"error": "Course not found"}), 404

        data = request.json
        grade = data.get('grade')

        if grade is None:
            return jsonify({'error': 'Grade is required'}), 400

        students_collection = mongo.db.students

        # Check if the student is enrolled in the course
        if student_id in course.get("enrolledStudents", []):
            student = students_collection.find_one({"studentID": student_id})
            if student:
                # Check if the student has a grades dictionary, create one if not
                if 'grades' not in student:
                    student['grades'] = {}
                student['grades'][course['courseID']] = grade

                students_collection.update_one(
                    {"studentID": student_id},
                    {"$set": {"grades": student['grades']}}
                )

                updated_student = {
                    "studentID": student_id,
                    "grades": student['grades']
                }

                return jsonify({'message': 'Grade added successfully', 'updated_student': updated_student}), 200
            else:
                return jsonify({"error": "Student not found"}), 404
        else:
            return jsonify({"error": "Student is not enrolled in the course"}), 400

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

# Define a route to get the department of an instructor
@app.route('/department/<string:instructorID>', methods=['GET'])
def get_department(instructorID):
    instructor = mongo.db.instructors.find_one({'instructorID': instructorID})

    if instructor:
        department = instructor.get('department')
        return jsonify({'instructorID': instructorID, 'department': department})
    else:
        return jsonify({'message': 'Instructor not found'})

# Define a route to fetch all courses
@app.route('/courses', methods=['GET'])
def get_courses():
    # Access the 'courses' collection in the MongoDB database
    courses_collection = mongo.db.courses
    courses = courses_collection.find()
    
    # Create a list of course objects using from_dict()
    course_list = [Courses.from_dict(course) for course in courses]
    
    # Return the list of courses as JSON
    return jsonify([course.to_dict() for course in course_list])

# Define a route to create a new course
@app.route('/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    new_course = Courses.from_dict(data)
    
    # Access the 'courses' collection in the MongoDB database
    courses_collection = mongo.db.courses
    result = courses_collection.insert_one(new_course.to_dict())
    
    # Return the inserted course's ID as a response
    return jsonify(str(result.inserted_id)), 201

# Define a route to delete a specific course by ID
@app.route('/courses/<string:course_id>', methods=['DELETE'])
def delete_course_by_id(course_id):
    # Access the 'courses' collection in the MongoDB database
    courses_collection = mongo.db.courses

    # Delete the course with the specified ID from the collection
    result = courses_collection.delete_one({"courseID": course_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Course deleted successfully"}), 200
    else:
        return jsonify({"message": "Course not found"}), 404
    
# Define a route to assign an instructor to a course
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

# Define a route to view courses with instructor information
@app.route('/view-courses', methods=['GET'])
def view_courses():
    courses_collection = mongo.db.courses 
    all_courses = courses_collection.find()

    # Initialize a list to store course data including instructor information
    courses_data = []

    for course in all_courses:
        course_data = Courses.from_dict(course)
        instructor_id = course_data.instructorID

        # Fetch instructor information based on instructorID
        if instructor_id:
            instructors_collection = mongo.db.instructors
            instructor = instructors_collection.find_one({'instructorID': instructor_id})
            if instructor:
                instructor_data = Instructors.from_dict(instructor)
                course_data.instructor_name = instructor_data.name
                course_data.instructor_department = instructor_data.department

        courses_data.append(course_data)

    # Convert the list of course data to dictionaries and return as JSON
    courses_json = [course.to_dict() for course in courses_data]

    return jsonify(courses_json)

# Define a route to enroll a student in a course
@app.route('/enrollment', methods=['POST'])
def enroll_student():
    data = request.json
    studentID = data.get('studentID')
    courseID = data.get('courseID')
    
    # Check if the student and course exist in the database
    student = mongo.db.students.find_one({'studentID': studentID})
    course = mongo.db.courses.find_one({'courseID': courseID})
    students_collection = mongo.db.students
    
    if student and course:
        enrolledCourses = student.get('enrolledCourses', [])
        enrolledStudents = course.get('enrolledStudents', [])
        
        if courseID not in enrolledCourses and studentID not in enrolledStudents:
            # Add the course ID to the student's enrolled courses
            enrolledCourses.append(courseID)
            mongo.db.students.update_one({'studentID': studentID}, {'$set': {'enrolledCourses': enrolledCourses}})
            
            # Add the student ID to the course's enrolled students
            enrolledStudents.append(studentID)
            mongo.db.courses.update_one({'courseID': courseID}, {'$set': {'enrolledStudents': enrolledStudents}})
            
            # Increment the creditsEarned for the student by 3
            current_credits_earned = int(student.get('creditsEarned', 0))
            new_credits_earned = current_credits_earned + 3
            students_collection.update_one({'studentID': studentID}, {'$set': {'creditsEarned': new_credits_earned}})
            
            return jsonify({'message': 'Enrollment successful'})
        else:
            return jsonify({'message': 'Student is already enrolled in this course'})
    else:
        return jsonify({'message': 'Student or course not found'})

# Define a route to get courses enrolled by a student
@app.route('/student-courses/<string:studentID>', methods=['GET'])
def get_student_courses(studentID):
    # Find the student based on the provided studentID
    student = mongo.db.students.find_one({'studentID': studentID})

    if student:
        # Retrieve the list of course IDs enrolled by the student
        enrolledCourses = student.get('enrolledCourses', [])

        # Initialize a list to store course data
        courses_data = []

        for courseID in enrolledCourses:
            # Fetch the course data based on courseID
            course = mongo.db.courses.find_one({'courseID': courseID})
            if course:
                # Convert the Courses object to a dictionary
                course_data = Courses.from_dict(course).to_dict()

                # Fetch instructor information based on instructorID
                instructor_id = course_data.get('instructorID')
                if instructor_id:
                    instructors_collection = mongo.db.instructors
                    instructor = instructors_collection.find_one({'instructorID': instructor_id})
                    if instructor:
                        instructor_data = Instructors.from_dict(instructor)
                        course_data['instructor_name'] = instructor_data.name
                        course_data['instructor_department'] = instructor_data.department

                courses_data.append(course_data)

        # Convert the list of course data to JSON
        return jsonify(courses_data)

    else:
        return jsonify({'message': 'Student not found'})
    
# Define a route to remove a course from a student's enrollment
@app.route('/student-courses/<string:studentID>/remove/<string:courseID>', methods=['DELETE'])
def remove_student_course(studentID, courseID):
    # Check if the student exists in the database
    student = mongo.db.students.find_one({'studentID': studentID})
    
    if student:
        # Check if the student has a grades dictionary
        if 'grades' in student:
            grades = student['grades']

            # Check if the courseID exists in the grades dictionary
            if courseID in grades:
                # Remove the courseID:grade pair from the grades dictionary
                del grades[courseID]
                mongo.db.students.update_one({'studentID': studentID}, {'$set': {'grades': grades}})

        enrolledCourses = student.get('enrolledCourses', [])
        if courseID in enrolledCourses:
            # Remove the course ID from the student's enrolled courses
            enrolledCourses.remove(courseID)
            mongo.db.students.update_one({'studentID': studentID}, {'$set': {'enrolledCourses': enrolledCourses}})

            # Remove the student ID from the course's enrolled students
            mongo.db.courses.update_one({'courseID': courseID}, {'$pull': {'enrolledStudents': studentID}})
            
            # Decrement the creditsEarned for the student by 3, never goes below 0 tho
            currentCreditsEarned = int(student.get('creditsEarned', 0))
            newCreditsEarned = max(currentCreditsEarned - 3, 0)
            mongo.db.students.update_one({'studentID': studentID}, {'$set': {'creditsEarned': newCreditsEarned}})
            
            return jsonify({'message': 'Course removed successfully'})
    
    return jsonify({'message': 'Student or course not found'}), 404



# Start the Flask application if this script is executed(without major bugs)
if __name__ == '__main__':
    app.run(debug=True)
