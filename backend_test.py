#!/usr/bin/env python3
"""
Backend Authentication Testing for Hindi Grammar Learning App
Tests all authentication endpoints and scenarios
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://grammarguru.preview.emergentagent.com/api"

class AuthTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_user_mobile = "9876543210"
        self.test_user_data = {
            "name": "Test Student",
            "mobile": self.test_user_mobile,
            "school": "Test School",
            "class_name": "Class 8",
            "password": "test123"
        }
        self.access_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "response": response_data,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def cleanup_test_user(self):
        """Clean up test user from database if exists"""
        print("🧹 Cleaning up any existing test user...")
        # We'll try to register and if it fails due to existing user, that's expected
        # The actual cleanup would require direct database access which we don't have in tests
        
    def test_user_registration(self):
        """Test 1: User Registration"""
        print("🔍 Testing User Registration...")
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=self.test_user_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify response structure
                required_fields = ["access_token", "token_type", "user"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test(
                        "User Registration", 
                        False, 
                        f"Missing fields: {missing_fields}",
                        data
                    )
                    return False
                
                # Verify user object structure
                user = data["user"]
                user_fields = ["id", "name", "mobile", "school", "class_name"]
                missing_user_fields = [field for field in user_fields if field not in user]
                
                if missing_user_fields:
                    self.log_test(
                        "User Registration", 
                        False, 
                        f"Missing user fields: {missing_user_fields}",
                        data
                    )
                    return False
                
                # Verify user data matches input
                if (user["name"] != self.test_user_data["name"] or
                    user["mobile"] != self.test_user_data["mobile"] or
                    user["school"] != self.test_user_data["school"] or
                    user["class_name"] != self.test_user_data["class_name"]):
                    self.log_test(
                        "User Registration", 
                        False, 
                        "User data doesn't match input",
                        data
                    )
                    return False
                
                # Store token for later tests
                self.access_token = data["access_token"]
                
                self.log_test(
                    "User Registration", 
                    True, 
                    f"User registered successfully. Token: {self.access_token[:20]}..."
                )
                return True
                
            else:
                self.log_test(
                    "User Registration", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "User Registration", 
                False, 
                f"Exception: {str(e)}"
            )
            return False

    def test_user_login(self):
        """Test 2: User Login"""
        print("🔍 Testing User Login...")
        
        login_data = {
            "mobile": self.test_user_mobile,
            "password": "test123"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify response structure
                required_fields = ["access_token", "token_type", "user"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test(
                        "User Login", 
                        False, 
                        f"Missing fields: {missing_fields}",
                        data
                    )
                    return False
                
                # Verify user data is same as registration
                user = data["user"]
                if (user["name"] != self.test_user_data["name"] or
                    user["mobile"] != self.test_user_data["mobile"]):
                    self.log_test(
                        "User Login", 
                        False, 
                        "User data doesn't match registration",
                        data
                    )
                    return False
                
                # Update token
                self.access_token = data["access_token"]
                
                self.log_test(
                    "User Login", 
                    True, 
                    f"Login successful. Token: {self.access_token[:20]}..."
                )
                return True
                
            else:
                self.log_test(
                    "User Login", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "User Login", 
                False, 
                f"Exception: {str(e)}"
            )
            return False

    def test_get_current_user(self):
        """Test 3: Get Current User (Protected Route)"""
        print("🔍 Testing Get Current User...")
        
        if not self.access_token:
            self.log_test(
                "Get Current User", 
                False, 
                "No access token available"
            )
            return False
        
        try:
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/auth/me",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify user data structure
                user_fields = ["id", "name", "mobile", "school", "class_name", "created_at"]
                missing_fields = [field for field in user_fields if field not in data]
                
                if missing_fields:
                    self.log_test(
                        "Get Current User", 
                        False, 
                        f"Missing fields: {missing_fields}",
                        data
                    )
                    return False
                
                # Verify no password field
                if "password" in data:
                    self.log_test(
                        "Get Current User", 
                        False, 
                        "Password field should not be returned",
                        data
                    )
                    return False
                
                # Verify user data matches
                if (data["name"] != self.test_user_data["name"] or
                    data["mobile"] != self.test_user_data["mobile"]):
                    self.log_test(
                        "Get Current User", 
                        False, 
                        "User data doesn't match",
                        data
                    )
                    return False
                
                self.log_test(
                    "Get Current User", 
                    True, 
                    "User profile retrieved successfully"
                )
                return True
                
            else:
                self.log_test(
                    "Get Current User", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Get Current User", 
                False, 
                f"Exception: {str(e)}"
            )
            return False

    def test_invalid_login(self):
        """Test 4: Invalid Login"""
        print("🔍 Testing Invalid Login...")
        
        invalid_login_data = {
            "mobile": self.test_user_mobile,
            "password": "wrongpassword"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=invalid_login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 401:
                data = response.json()
                
                # Check for Hindi error message
                if "detail" in data:
                    detail = data["detail"]
                    if "गलत" in detail or "मोबाइल" in detail:
                        self.log_test(
                            "Invalid Login", 
                            True, 
                            f"Correct 401 response with Hindi message: {detail}"
                        )
                        return True
                    else:
                        self.log_test(
                            "Invalid Login", 
                            False, 
                            f"Error message not in Hindi: {detail}"
                        )
                        return False
                else:
                    self.log_test(
                        "Invalid Login", 
                        False, 
                        "No error detail in response",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Invalid Login", 
                    False, 
                    f"Expected 401, got {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Invalid Login", 
                False, 
                f"Exception: {str(e)}"
            )
            return False

    def test_duplicate_registration(self):
        """Test 5: Duplicate Registration"""
        print("🔍 Testing Duplicate Registration...")
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=self.test_user_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                
                # Check for specific Hindi error message
                if "detail" in data:
                    detail = data["detail"]
                    expected_message = "यह मोबाइल नंबर पहले से पंजीकृत है"
                    if detail == expected_message:
                        self.log_test(
                            "Duplicate Registration", 
                            True, 
                            f"Correct error message: {detail}"
                        )
                        return True
                    else:
                        self.log_test(
                            "Duplicate Registration", 
                            False, 
                            f"Wrong error message. Expected: '{expected_message}', Got: '{detail}'"
                        )
                        return False
                else:
                    self.log_test(
                        "Duplicate Registration", 
                        False, 
                        "No error detail in response",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Duplicate Registration", 
                    False, 
                    f"Expected 400, got {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Duplicate Registration", 
                False, 
                f"Exception: {str(e)}"
            )
            return False

    def test_invalid_mobile_registration(self):
        """Test 6: Invalid Mobile Number Registration"""
        print("🔍 Testing Invalid Mobile Number Registration...")
        
        invalid_user_data = self.test_user_data.copy()
        invalid_user_data["mobile"] = "1234567890"  # Invalid - doesn't start with 6-9
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=invalid_user_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 422:
                data = response.json()
                
                # Check for validation error
                if "detail" in data and isinstance(data["detail"], list):
                    for error in data["detail"]:
                        if "mobile" in error.get("loc", []):
                            msg = error.get("msg", "")
                            if "मोबाइल" in msg and "6-9" in msg:
                                self.log_test(
                                    "Invalid Mobile Registration", 
                                    True, 
                                    f"Correct validation error: {msg}"
                                )
                                return True
                    
                    self.log_test(
                        "Invalid Mobile Registration", 
                        False, 
                        f"Mobile validation error not found in: {data}"
                    )
                    return False
                else:
                    self.log_test(
                        "Invalid Mobile Registration", 
                        False, 
                        "No validation detail in response",
                        data
                    )
                    return False
            else:
                self.log_test(
                    "Invalid Mobile Registration", 
                    False, 
                    f"Expected 422, got {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Invalid Mobile Registration", 
                False, 
                f"Exception: {str(e)}"
            )
            return False

    def test_jwt_token_format(self):
        """Test 7: JWT Token Format Verification"""
        print("🔍 Testing JWT Token Format...")
        
        if not self.access_token:
            self.log_test(
                "JWT Token Format", 
                False, 
                "No access token available"
            )
            return False
        
        # JWT tokens have 3 parts separated by dots
        parts = self.access_token.split('.')
        
        if len(parts) == 3:
            self.log_test(
                "JWT Token Format", 
                True, 
                f"Valid JWT format with 3 parts. Length: {len(self.access_token)}"
            )
            return True
        else:
            self.log_test(
                "JWT Token Format", 
                False, 
                f"Invalid JWT format. Expected 3 parts, got {len(parts)}"
            )
            return False

    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 Starting Authentication System Tests")
        print("=" * 60)
        
        # Clean up any existing test user
        self.cleanup_test_user()
        
        # Run tests in sequence
        tests = [
            self.test_user_registration,
            self.test_user_login,
            self.test_get_current_user,
            self.test_invalid_login,
            self.test_duplicate_registration,
            self.test_invalid_mobile_registration,
            self.test_jwt_token_format
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All authentication tests PASSED!")
            return True
        else:
            print(f"⚠️  {total - passed} test(s) FAILED!")
            return False

    def print_summary(self):
        """Print detailed test summary"""
        print("\n" + "=" * 60)
        print("📋 DETAILED TEST SUMMARY")
        print("=" * 60)
        
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details']:
                print(f"   {result['details']}")
        
        passed = sum(1 for r in self.test_results if "PASS" in r['status'])
        total = len(self.test_results)
        
        print(f"\n📊 Final Score: {passed}/{total} tests passed")
        
        if passed == total:
            print("✅ Authentication system is working correctly!")
        else:
            print("❌ Authentication system has issues that need attention!")

def main():
    """Main test execution"""
    print("Hindi Grammar Learning App - Authentication Testing")
    print(f"Backend URL: {BACKEND_URL}")
    print()
    
    tester = AuthTester()
    success = tester.run_all_tests()
    tester.print_summary()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())