import unittest
from flask import session
from backend.app import app, mongo  # Import your Flask app and MongoDB instance
import json

class TestLogin(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        self.mongo = mongo
        self.mongo.db.users.drop()  # Clear the users collection before each test

    def tearDown(self):
        self.app_context.pop()
        
    def test_successful_login(self):
        # Register a test user
        registration_data = {'username': 'testuser', 'password': 'password'}
        response = self.app.post('/register', json=registration_data)
        self.assertEqual(response.status_code, 201)

        # Attempt to log in with the registered user
        login_data = {'username': 'testuser', 'password': 'password'}
        response = self.app.post('/login', json=login_data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('user_id' in session)

    def test_failed_login(self):
        # Attempt to log in with a non-registered user
        login_data = {'username': 'nonexistent', 'password': 'wrongpassword'}
        response = self.app.post('/login', json=login_data)
        self.assertEqual(response.status_code, 401)
        self.assertFalse('user_id' in session)

if __name__ == '__main__':
    unittest.main()
