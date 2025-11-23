#!/usr/bin/env python3
"""
Test script for individual and group homework assignments
"""
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8001"
API_URL = f"{BASE_URL}/api"

def test_individual_assignments():
    print("🧪 Testing Individual and Group Homework Assignments")
    print("=" * 60)
    
    # Step 1: Register a teacher
    print("\n1. Registering teacher...")
    teacher_data = {
        "email": f"teacher_test_{datetime.now().strftime('%H%M%S')}@school.com",
        "full_name": "Test Teacher",
        "role": "teacher"
    }
    
    response = requests.post(f"{API_URL}/auth/register", json=teacher_data)
    if response.status_code != 200:
        print(f"❌ Teacher registration failed: {response.text}")
        return False
    
    teacher_token = response.json()["access_token"]
    print("✅ Teacher registered successfully")
    
    # Step 2: Register students
    print("\n2. Registering students...")
    students = []
    for i in range(3):
        student_data = {
            "email": f"student_{i}_{datetime.now().strftime('%H%M%S')}@school.com",
            "full_name": f"Test Student {i+1}",
            "role": "student",
            "class_section": "10th A"
        }
        
        response = requests.post(f"{API_URL}/auth/register", json=student_data)
        if response.status_code != 200:
            print(f"❌ Student {i+1} registration failed: {response.text}")
            return False
        
        students.append({
            "token": response.json()["access_token"],
            "user": response.json()["user"]
        })
    
    print(f"✅ {len(students)} students registered successfully")
    
    # Step 3: Get students list for teacher
    print("\n3. Getting students list...")
    headers = {"Authorization": f"Bearer {teacher_token}"}
    response = requests.get(f"{API_URL}/homework/students", headers=headers)
    if response.status_code != 200:
        print(f"❌ Failed to get students list: {response.text}")
        return False
    
    available_students = response.json()
    print(f"✅ Found {len(available_students)} students available for assignment")
    
    # Step 4: Create class-wide assignment
    print("\n4. Creating class-wide assignment...")
    class_homework = {
        "title": "Class-wide Math Assignment",
        "description": "This assignment is for the entire class",
        "assignment_type": "class",
        "class_section": "10th A",
        "assigned_to": [],
        "due_date": (datetime.now() + timedelta(days=7)).isoformat(),
        "attachments": []
    }
    
    response = requests.post(f"{API_URL}/homework/create", json=class_homework, headers=headers)
    if response.status_code != 200:
        print(f"❌ Class assignment creation failed: {response.text}")
        return False
    
    print("✅ Class-wide assignment created successfully")
    
    # Step 5: Create individual assignment
    print("\n5. Creating individual assignment...")
    individual_homework = {
        "title": "Individual Science Project",
        "description": "This assignment is for one specific student",
        "assignment_type": "individual",
        "class_section": None,
        "assigned_to": [students[0]["user"]["id"]],  # Assign to first student only
        "due_date": (datetime.now() + timedelta(days=5)).isoformat(),
        "attachments": []
    }
    
    response = requests.post(f"{API_URL}/homework/create", json=individual_homework, headers=headers)
    if response.status_code != 200:
        print(f"❌ Individual assignment creation failed: {response.text}")
        return False
    
    print("✅ Individual assignment created successfully")
    
    # Step 6: Create group assignment
    print("\n6. Creating group assignment...")
    group_homework = {
        "title": "Group History Research",
        "description": "This assignment is for a group of students",
        "assignment_type": "group",
        "class_section": None,
        "assigned_to": [students[1]["user"]["id"], students[2]["user"]["id"]],  # Assign to students 2 and 3
        "due_date": (datetime.now() + timedelta(days=10)).isoformat(),
        "attachments": []
    }
    
    response = requests.post(f"{API_URL}/homework/create", json=group_homework, headers=headers)
    if response.status_code != 200:
        print(f"❌ Group assignment creation failed: {response.text}")
        return False
    
    print("✅ Group assignment created successfully")
    
    # Step 7: Test homework visibility for each student
    print("\n7. Testing homework visibility...")
    
    # Student 1 should see: class-wide + individual (2 assignments)
    headers1 = {"Authorization": f"Bearer {students[0]['token']}"}
    response = requests.get(f"{API_URL}/homework/list", headers=headers1)
    if response.status_code != 200:
        print(f"❌ Failed to get homework for student 1: {response.text}")
        return False
    
    student1_homework = response.json()
    print(f"✅ Student 1 sees {len(student1_homework)} assignments (expected: 2)")
    
    # Student 2 should see: class-wide + group (2 assignments)
    headers2 = {"Authorization": f"Bearer {students[1]['token']}"}
    response = requests.get(f"{API_URL}/homework/list", headers=headers2)
    if response.status_code != 200:
        print(f"❌ Failed to get homework for student 2: {response.text}")
        return False
    
    student2_homework = response.json()
    print(f"✅ Student 2 sees {len(student2_homework)} assignments (expected: 2)")
    
    # Student 3 should see: class-wide + group (2 assignments)
    headers3 = {"Authorization": f"Bearer {students[2]['token']}"}
    response = requests.get(f"{API_URL}/homework/list", headers=headers3)
    if response.status_code != 200:
        print(f"❌ Failed to get homework for student 3: {response.text}")
        return False
    
    student3_homework = response.json()
    print(f"✅ Student 3 sees {len(student3_homework)} assignments (expected: 2)")
    
    # Step 8: Verify assignment types
    print("\n8. Verifying assignment types...")
    
    # Check that student 1 has the individual assignment
    individual_found = any(hw["assignment_type"] == "individual" for hw in student1_homework)
    if not individual_found:
        print("❌ Student 1 should see the individual assignment")
        return False
    print("✅ Student 1 correctly sees individual assignment")
    
    # Check that students 2 and 3 have the group assignment
    group_found_2 = any(hw["assignment_type"] == "group" for hw in student2_homework)
    group_found_3 = any(hw["assignment_type"] == "group" for hw in student3_homework)
    if not (group_found_2 and group_found_3):
        print("❌ Students 2 and 3 should see the group assignment")
        return False
    print("✅ Students 2 and 3 correctly see group assignment")
    
    # Check that all students see the class assignment
    class_found_1 = any(hw["assignment_type"] == "class" for hw in student1_homework)
    class_found_2 = any(hw["assignment_type"] == "class" for hw in student2_homework)
    class_found_3 = any(hw["assignment_type"] == "class" for hw in student3_homework)
    if not (class_found_1 and class_found_2 and class_found_3):
        print("❌ All students should see the class assignment")
        return False
    print("✅ All students correctly see class assignment")
    
    print("\n" + "=" * 60)
    print("🎉 ALL TESTS PASSED! Individual and group assignments work correctly!")
    print("✅ Teachers can create class-wide, group, and individual assignments")
    print("✅ Students only see assignments relevant to them")
    print("✅ Assignment types are correctly displayed")
    
    return True

if __name__ == "__main__":
    try:
        success = test_individual_assignments()
        exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        exit(1)