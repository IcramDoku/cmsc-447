#### Hello! Ignore this readme, it was helpful to me when in building stages.

1. You will need to specify what libraries will be needed, such as Flask, Flask-CORS, BSON, Flask-PyMongo, and more.
1. Specifying the types of data entered into the database as numbers will limit them to only that type on the UI.

or just do `python3 app.py` do NOT click 'Run Python File' for Mac

THIS Connection is valid: \
->`Run Python File` do NOT do 'node app.py' \
mac->`python3 app.py` do NOT click 'Run Python File' \
The schema does not need to be set up; the program will create it if it does not already exist. BUT defining the database is very important. \
Tested with: \
C:\Users\icram>curl --X POST -H "Content-Type: application/json" --data-binary "{\"username\": \"john_doe\", \"name\": \"John Doe\", \"password\": \"password123\"}" http://127.0.0.1:5000/users \
curl: (6) Could not resolve host: POST
{
  "message": "User created successfully"
}

C:\Users\icram>curl http://127.0.0.1:5000/users  \
[ \
  { \
    "_id": "651cd938c64ab8f66f90475a", \
    "name": "John Doe", \
    "password": "password123", \
    "username": "john_doe"m \
  } \
] \
 \

C:\Users\icram>curl --X POST -H "Content-Type: application/json" --data-binary "{\"studentID\": \"john_doe\", \"name\": \"John Doe\", \"creditsEarned\": \"password123\"}" http://127.0.0.1:5000/students
curl: (6) Could not resolve host: POST
{
  "message": "Student created successfully"
} \
 \

C:\Users\icram>curl http://127.0.0.1:5000/users \ 
[ \
  { \
    "_id": "651cd938c64ab8f66f90475a", \
    "name": "John Doe", \
    "password": "password123", \
    "username": "john_doe" \
  } \
] \
