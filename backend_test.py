import requests
import sys
import json
from datetime import datetime, timedelta
import base64

class SchoolManagementTester:
    def __init__(self, base_url="https://quiz-master-212.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.teacher_token = None
        self.student_token = None
        self.teacher_user = None
        self.student_user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_teacher_registration(self):
        """Test teacher registration"""
        teacher_data = {
            "email": f"teacher_{datetime.now().strftime('%H%M%S')}@school.com",
            "password": "TeacherPass123!",
            "full_name": "Test Teacher",
            "role": "teacher"
        }
        
        success, response = self.run_test(
            "Teacher Registration",
            "POST",
            "auth/register",
            200,
            data=teacher_data
        )
        
        if success and 'access_token' in response:
            self.teacher_token = response['access_token']
            self.teacher_user = response['user']
            return True
        return False

    def test_student_registration(self):
        """Test student registration"""
        student_data = {
            "email": f"student_{datetime.now().strftime('%H%M%S')}@school.com",
            "password": "StudentPass123!",
            "full_name": "Test Student",
            "role": "student",
            "class_section": "10th A"
        }
        
        success, response = self.run_test(
            "Student Registration",
            "POST",
            "auth/register",
            200,
            data=student_data
        )
        
        if success and 'access_token' in response:
            self.student_token = response['access_token']
            self.student_user = response['user']
            return True
        return False

    def test_login(self):
        """Test login functionality"""
        if not self.teacher_user:
            return False
            
        login_data = {
            "email": self.teacher_user['email'],
            "password": "TeacherPass123!"
        }
        
        success, response = self.run_test(
            "Teacher Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        return success and 'access_token' in response

    def test_auth_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200,
            token=self.teacher_token
        )
        return success

    def test_student_attendance(self):
        """Test student attendance marking"""
        success, response = self.run_test(
            "Mark Attendance",
            "POST",
            "attendance/mark",
            200,
            token=self.student_token
        )
        
        if success:
            # Test duplicate attendance (should fail)
            success2, _ = self.run_test(
                "Duplicate Attendance (Should Fail)",
                "POST",
                "attendance/mark",
                400,
                token=self.student_token
            )
            return success2
        return False

    def test_attendance_records(self):
        """Test attendance record retrieval"""
        # Test student viewing their records
        success1, _ = self.run_test(
            "Get My Attendance Records",
            "GET",
            "attendance/my-records",
            200,
            token=self.student_token
        )
        
        # Test teacher viewing class attendance
        success2, _ = self.run_test(
            "Get Class Attendance",
            "GET",
            "attendance/class/10th A",
            200,
            token=self.teacher_token
        )
        
        # Test attendance status
        success3, _ = self.run_test(
            "Get Today Attendance Status",
            "GET",
            "attendance/today-status",
            200,
            token=self.student_token
        )
        
        return success1 and success2 and success3

    def test_homework_creation(self):
        """Test homework creation by teacher"""
        due_date = (datetime.now() + timedelta(days=7)).isoformat()
        homework_data = {
            "title": "Test Homework Assignment",
            "description": "This is a test homework assignment for testing purposes",
            "class_section": "10th A",
            "due_date": due_date,
            "attachments": []
        }
        
        success, response = self.run_test(
            "Create Homework",
            "POST",
            "homework/create",
            200,
            data=homework_data,
            token=self.teacher_token
        )
        
        if success:
            self.homework_id = response.get('homework', {}).get('id')
            return True
        return False

    def test_homework_list(self):
        """Test homework listing"""
        # Teacher view
        success1, _ = self.run_test(
            "List Homework (Teacher)",
            "GET",
            "homework/list",
            200,
            token=self.teacher_token
        )
        
        # Student view
        success2, _ = self.run_test(
            "List Homework (Student)",
            "GET",
            "homework/list",
            200,
            token=self.student_token
        )
        
        return success1 and success2

    def test_homework_submission(self):
        """Test homework submission by student"""
        if not hasattr(self, 'homework_id') or not self.homework_id:
            print("❌ No homework ID available for submission test")
            return False
            
        submission_data = {
            "homework_id": self.homework_id,
            "submission_text": "This is my test homework submission",
            "file_data": None,
            "file_name": None
        }
        
        success, response = self.run_test(
            "Submit Homework",
            "POST",
            "homework/submit",
            200,
            data=submission_data,
            token=self.student_token
        )
        
        if success:
            self.submission_id = response.get('submission', {}).get('id')
            return True
        return False

    def test_homework_grading(self):
        """Test homework grading by teacher"""
        if not hasattr(self, 'homework_id') or not self.homework_id:
            return False
            
        # First get submissions
        success1, submissions = self.run_test(
            "Get Homework Submissions",
            "GET",
            f"homework/{self.homework_id}/submissions",
            200,
            token=self.teacher_token
        )
        
        if success1 and submissions and len(submissions) > 0:
            submission_id = submissions[0]['id']
            # Grade the submission
            success2, _ = self.run_test(
                "Grade Homework",
                "PUT",
                f"homework/submission/{submission_id}/grade?grade=A&feedback=Excellent work!",
                200,
                token=self.teacher_token
            )
            return success2
        return False

    def test_quiz_creation(self):
        """Test quiz creation by teacher"""
        quiz_data = {
            "title": "Test Quiz",
            "description": "This is a test quiz for testing purposes",
            "class_section": "10th A",
            "due_date": None,
            "questions": [
                {
                    "question": "What is 2 + 2?",
                    "type": "mcq",
                    "options": ["3", "4", "5", "6"],
                    "correct_answer": "4",
                    "points": 1
                },
                {
                    "question": "Is Python a programming language?",
                    "type": "true_false",
                    "options": None,
                    "correct_answer": "true",
                    "points": 1
                }
            ],
            "total_points": 2
        }
        
        success, response = self.run_test(
            "Create Quiz",
            "POST",
            "quiz/create",
            200,
            data=quiz_data,
            token=self.teacher_token
        )
        
        if success:
            self.quiz_id = response.get('quiz', {}).get('id')
            return True
        return False

    def test_quiz_list(self):
        """Test quiz listing"""
        # Teacher view
        success1, _ = self.run_test(
            "List Quizzes (Teacher)",
            "GET",
            "quiz/list",
            200,
            token=self.teacher_token
        )
        
        # Student view
        success2, _ = self.run_test(
            "List Quizzes (Student)",
            "GET",
            "quiz/list",
            200,
            token=self.student_token
        )
        
        return success1 and success2

    def test_quiz_taking(self):
        """Test quiz taking by student"""
        if not hasattr(self, 'quiz_id') or not self.quiz_id:
            print("❌ No quiz ID available for taking test")
            return False
            
        # First get the quiz
        success1, quiz = self.run_test(
            "Get Quiz for Taking",
            "GET",
            f"quiz/{self.quiz_id}",
            200,
            token=self.student_token
        )
        
        if success1:
            # Submit quiz answers
            submission_data = {
                "quiz_id": self.quiz_id,
                "answers": [
                    {"question_index": 0, "answer": "4"},
                    {"question_index": 1, "answer": "true"}
                ]
            }
            
            success2, response = self.run_test(
                "Submit Quiz",
                "POST",
                "quiz/submit",
                200,
                data=submission_data,
                token=self.student_token
            )
            
            if success2:
                print(f"   Quiz Score: {response.get('score', 0)}/{response.get('total_points', 0)}")
                return True
        return False

    def test_quiz_feedback(self):
        """Test quiz feedback by teacher"""
        if not hasattr(self, 'quiz_id') or not self.quiz_id:
            return False
            
        # Get quiz submissions
        success1, submissions = self.run_test(
            "Get Quiz Submissions",
            "GET",
            f"quiz/{self.quiz_id}/submissions",
            200,
            token=self.teacher_token
        )
        
        if success1 and submissions and len(submissions) > 0:
            submission_id = submissions[0]['id']
            success2, _ = self.run_test(
                "Add Quiz Feedback",
                "PUT",
                f"quiz/submission/{submission_id}/feedback?feedback=Great job on the quiz!",
                200,
                token=self.teacher_token
            )
            return success2
        return False

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        # Teacher stats
        success1, teacher_stats = self.run_test(
            "Get Teacher Dashboard Stats",
            "GET",
            "dashboard/stats",
            200,
            token=self.teacher_token
        )
        
        # Student stats
        success2, student_stats = self.run_test(
            "Get Student Dashboard Stats",
            "GET",
            "dashboard/stats",
            200,
            token=self.student_token
        )
        
        if success1:
            print(f"   Teacher Stats: {teacher_stats}")
        if success2:
            print(f"   Student Stats: {student_stats}")
            
        return success1 and success2

def main():
    print("🚀 Starting School Management System API Tests")
    print("=" * 60)
    
    tester = SchoolManagementTester()
    
    # Authentication Tests
    print("\n📝 AUTHENTICATION TESTS")
    if not tester.test_teacher_registration():
        print("❌ Teacher registration failed, stopping tests")
        return 1
        
    if not tester.test_student_registration():
        print("❌ Student registration failed, stopping tests")
        return 1
        
    if not tester.test_login():
        print("❌ Login test failed")
        
    if not tester.test_auth_me():
        print("❌ Auth me test failed")
    
    # Attendance Tests
    print("\n📅 ATTENDANCE TESTS")
    if not tester.test_student_attendance():
        print("❌ Attendance marking failed")
        
    if not tester.test_attendance_records():
        print("❌ Attendance records test failed")
    
    # Homework Tests
    print("\n📚 HOMEWORK TESTS")
    if not tester.test_homework_creation():
        print("❌ Homework creation failed")
        
    if not tester.test_homework_list():
        print("❌ Homework listing failed")
        
    if not tester.test_homework_submission():
        print("❌ Homework submission failed")
        
    if not tester.test_homework_grading():
        print("❌ Homework grading failed")
    
    # Quiz Tests
    print("\n🧠 QUIZ TESTS")
    if not tester.test_quiz_creation():
        print("❌ Quiz creation failed")
        
    if not tester.test_quiz_list():
        print("❌ Quiz listing failed")
        
    if not tester.test_quiz_taking():
        print("❌ Quiz taking failed")
        
    if not tester.test_quiz_feedback():
        print("❌ Quiz feedback failed")
    
    # Dashboard Tests
    print("\n📊 DASHBOARD TESTS")
    if not tester.test_dashboard_stats():
        print("❌ Dashboard stats failed")
    
    # Print Results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            print(f"   - {failure}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())