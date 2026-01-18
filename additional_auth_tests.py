#!/usr/bin/env python3
"""
Additional Authentication Tests for Edge Cases
"""

import requests
import json

BACKEND_URL = "https://grammarguru.preview.emergentagent.com/api"

def test_missing_authorization_header():
    """Test accessing protected route without authorization header"""
    print("🔍 Testing missing authorization header...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/auth/me", timeout=10)
        
        if response.status_code == 401:
            data = response.json()
            print("✅ PASS: Correctly rejected request without auth header")
            print(f"   Response: {data}")
            return True
        else:
            print(f"❌ FAIL: Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ FAIL: Exception: {e}")
        return False

def test_invalid_token_format():
    """Test with invalid token format"""
    print("🔍 Testing invalid token format...")
    
    try:
        headers = {"Authorization": "Bearer invalid-token-format"}
        response = requests.get(f"{BACKEND_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code == 401:
            print("✅ PASS: Correctly rejected invalid token format")
            return True
        else:
            print(f"❌ FAIL: Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ FAIL: Exception: {e}")
        return False

def test_malformed_authorization_header():
    """Test with malformed authorization header"""
    print("🔍 Testing malformed authorization header...")
    
    try:
        headers = {"Authorization": "InvalidFormat token"}
        response = requests.get(f"{BACKEND_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code == 401:
            print("✅ PASS: Correctly rejected malformed auth header")
            return True
        else:
            print(f"❌ FAIL: Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ FAIL: Exception: {e}")
        return False

def test_short_password_validation():
    """Test password length validation"""
    print("🔍 Testing short password validation...")
    
    short_password_data = {
        "name": "Test User",
        "mobile": "9876543211",  # Different mobile to avoid conflict
        "school": "Test School",
        "class_name": "Class 8",
        "password": "123"  # Too short
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json=short_password_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 422:
            data = response.json()
            # Check for password validation error
            for error in data.get("detail", []):
                if "password" in error.get("loc", []):
                    msg = error.get("msg", "")
                    if "6 अक्षरों" in msg:
                        print("✅ PASS: Correctly validated short password")
                        print(f"   Error message: {msg}")
                        return True
            
            print(f"❌ FAIL: Password validation error not found: {data}")
            return False
        else:
            print(f"❌ FAIL: Expected 422, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ FAIL: Exception: {e}")
        return False

def run_additional_tests():
    """Run all additional tests"""
    print("🚀 Running Additional Authentication Tests")
    print("=" * 50)
    
    tests = [
        test_missing_authorization_header,
        test_invalid_token_format,
        test_malformed_authorization_header,
        test_short_password_validation
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Additional Tests: {passed}/{total} passed")
    
    if passed == total:
        print("🎉 All additional tests PASSED!")
    else:
        print(f"⚠️  {total - passed} additional test(s) FAILED!")
    
    return passed == total

if __name__ == "__main__":
    run_additional_tests()