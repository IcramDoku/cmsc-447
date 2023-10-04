THIS Connection is valid: \
->Run Python File \
The schema does not need to be setup, the program will create it, if it does not exist already. Defining the database is important tho. \
Tested with: \
C:\Users\icram>curl --X POST -H "Content-Type: application/json" --data-binary "{\"_id\": \"cat\", \"username\": \"john_doe\", \"name\": \"John Doe\", \"password\": \"password123\"}" http://127.0.0.1:5000/users \
curl: (6) Could not resolve host: POST
{
  "message": "User created successfully"
}

C:\Users\icram>curl http://127.0.0.1:5000/users \
[]
