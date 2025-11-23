from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ========== Auth Models ==========
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    role: Literal["teacher", "student", "principal"]
    class_section: Optional[str] = None  # Required for students

class UserLogin(BaseModel):
    email: EmailStr

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    role: Literal["teacher", "student", "principal"]
    class_section: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User


# ========== Attendance Models ==========
class AttendanceRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    student_name: str
    class_section: str
    date: str  # YYYY-MM-DD format
    marked_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: Literal["present", "absent"] = "present"


# ========== Homework Models ==========
class Homework(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    class_section: str
    due_date: str  # ISO format
    created_by: Optional[str] = None  # teacher id - set by backend
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    attachments: Optional[List[str]] = []  # base64 encoded files

class HomeworkSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    homework_id: str
    student_id: Optional[str] = None  # set by backend
    student_name: Optional[str] = None  # set by backend
    submission_text: Optional[str] = None
    file_data: Optional[str] = None  # base64 encoded
    file_name: Optional[str] = None
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_late: bool = False
    grade: Optional[str] = None
    feedback: Optional[str] = None


# ========== Test/Quiz Models ==========
class QuizQuestion(BaseModel):
    question: str
    type: Literal["mcq", "true_false"]
    options: Optional[List[str]] = None  # For MCQ
    correct_answer: str
    points: int = 1

class Quiz(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    class_section: str
    questions: List[QuizQuestion]
    total_points: int
    created_by: Optional[str] = None  # teacher id - set by backend
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    due_date: Optional[str] = None

class QuizAnswer(BaseModel):
    question_index: int
    answer: str

class QuizSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quiz_id: str
    student_id: Optional[str] = None  # set by backend
    student_name: Optional[str] = None  # set by backend
    answers: List[QuizAnswer]
    score: Optional[int] = None
    total_points: Optional[int] = None  # set by backend
    auto_graded: bool = False
    teacher_feedback: Optional[str] = None
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ========== Helper Functions ==========
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")


# ========== Auth Routes ==========
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate student has class_section
    if user_data.role == "student" and not user_data.class_section:
        raise HTTPException(status_code=400, detail="Class section is required for students")
    
    # Create user
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        class_section=user_data.class_section
    )
    
    user_doc = user.model_dump()
    user_doc["created_at"] = user_doc["created_at"].isoformat()
    
    await db.users.insert_one(user_doc)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(access_token=access_token, user=user)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    # Find user by email only (passwordless login)
    user_doc = await db.users.find_one({"email": user_data.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Email not found. Please register first.")
    
    user = User(**user_doc)
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(access_token=access_token, user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ========== Attendance Routes ==========
@api_router.post("/attendance/mark")
async def mark_attendance(current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can mark attendance")
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Check if already marked today
    existing = await db.attendance.find_one({
        "student_id": current_user.id,
        "date": today
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for today")
    
    attendance = AttendanceRecord(
        student_id=current_user.id,
        student_name=current_user.full_name,
        class_section=current_user.class_section,
        date=today,
        status="present"
    )
    
    doc = attendance.model_dump()
    doc["marked_at"] = doc["marked_at"].isoformat()
    await db.attendance.insert_one(doc)
    
    return {"message": "Attendance marked successfully", "attendance": attendance}

@api_router.get("/attendance/my-records")
async def get_my_attendance(current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can view their attendance")
    
    records = await db.attendance.find(
        {"student_id": current_user.id},
        {"_id": 0}
    ).sort("date", -1).to_list(1000)
    
    return records

@api_router.get("/attendance/class/{class_section}")
async def get_class_attendance(class_section: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view class attendance")
    
    records = await db.attendance.find(
        {"class_section": class_section},
        {"_id": 0}
    ).sort("date", -1).to_list(10000)
    
    return records

@api_router.get("/attendance/today-status")
async def get_today_attendance_status(current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can check their status")
    
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    record = await db.attendance.find_one({
        "student_id": current_user.id,
        "date": today
    })
    
    return {"marked_today": record is not None, "date": today}


# ========== Homework Routes ==========
@api_router.post("/homework/create")
async def create_homework(homework: Homework, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create homework")
    
    homework.created_by = current_user.id
    doc = homework.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.homework.insert_one(doc)
    return {"message": "Homework created successfully", "homework": homework}

@api_router.get("/homework/list")
async def list_homework(current_user: User = Depends(get_current_user)):
    if current_user.role == "teacher":
        homeworks = await db.homework.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    else:
        homeworks = await db.homework.find(
            {"class_section": current_user.class_section},
            {"_id": 0}
        ).sort("created_at", -1).to_list(1000)
    
    return homeworks

@api_router.post("/homework/submit")
async def submit_homework(submission: HomeworkSubmission, current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit homework")
    
    # Check if homework exists
    homework = await db.homework.find_one({"id": submission.homework_id})
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")
    
    # Check if already submitted
    existing = await db.homework_submissions.find_one({
        "homework_id": submission.homework_id,
        "student_id": current_user.id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Homework already submitted")
    
    # Check if late
    due_date = datetime.fromisoformat(homework["due_date"])
    if due_date.tzinfo is None:
        due_date = due_date.replace(tzinfo=timezone.utc)
    submission.is_late = datetime.now(timezone.utc) > due_date
    submission.student_id = current_user.id
    submission.student_name = current_user.full_name
    
    doc = submission.model_dump()
    doc["submitted_at"] = doc["submitted_at"].isoformat()
    
    await db.homework_submissions.insert_one(doc)
    return {"message": "Homework submitted successfully", "submission": submission}

@api_router.get("/homework/{homework_id}/submissions")
async def get_homework_submissions(homework_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view submissions")
    
    submissions = await db.homework_submissions.find(
        {"homework_id": homework_id},
        {"_id": 0}
    ).to_list(1000)
    
    return submissions

@api_router.put("/homework/submission/{submission_id}/grade")
async def grade_homework(submission_id: str, grade: str, feedback: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can grade homework")
    
    result = await db.homework_submissions.update_one(
        {"id": submission_id},
        {"$set": {"grade": grade, "feedback": feedback}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return {"message": "Homework graded successfully"}

@api_router.get("/homework/my-submissions")
async def get_my_submissions(current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can view their submissions")
    
    submissions = await db.homework_submissions.find(
        {"student_id": current_user.id},
        {"_id": 0}
    ).to_list(1000)
    
    return submissions


# ========== Quiz Routes ==========
@api_router.post("/quiz/create")
async def create_quiz(quiz: Quiz, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create quizzes")
    
    quiz.created_by = current_user.id
    doc = quiz.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.quizzes.insert_one(doc)
    return {"message": "Quiz created successfully", "quiz": quiz}

@api_router.get("/quiz/list")
async def list_quizzes(current_user: User = Depends(get_current_user)):
    if current_user.role == "teacher":
        quizzes = await db.quizzes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    else:
        # Students see quizzes without correct answers
        quizzes = await db.quizzes.find(
            {"class_section": current_user.class_section},
            {"_id": 0}
        ).sort("created_at", -1).to_list(1000)
        
        # Remove correct answers for students
        for quiz in quizzes:
            for question in quiz.get("questions", []):
                question.pop("correct_answer", None)
    
    return quizzes

@api_router.get("/quiz/{quiz_id}")
async def get_quiz(quiz_id: str, current_user: User = Depends(get_current_user)):
    quiz = await db.quizzes.find_one({"id": quiz_id}, {"_id": 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Remove correct answers for students
    if current_user.role == "student":
        for question in quiz.get("questions", []):
            question.pop("correct_answer", None)
    
    return quiz

@api_router.post("/quiz/submit")
async def submit_quiz(submission: QuizSubmission, current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit quizzes")
    
    # Check if quiz exists
    quiz = await db.quizzes.find_one({"id": submission.quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Check if already submitted
    existing = await db.quiz_submissions.find_one({
        "quiz_id": submission.quiz_id,
        "student_id": current_user.id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Quiz already submitted")
    
    # Auto-grade
    score = 0
    submission.total_points = quiz["total_points"]
    
    for answer in submission.answers:
        question = quiz["questions"][answer.question_index]
        if answer.answer.strip().lower() == question["correct_answer"].strip().lower():
            score += question["points"]
    
    submission.score = score
    submission.auto_graded = True
    submission.student_id = current_user.id
    submission.student_name = current_user.full_name
    
    doc = submission.model_dump()
    doc["submitted_at"] = doc["submitted_at"].isoformat()
    
    await db.quiz_submissions.insert_one(doc)
    return {"message": "Quiz submitted successfully", "score": score, "total_points": submission.total_points}

@api_router.get("/quiz/{quiz_id}/submissions")
async def get_quiz_submissions(quiz_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view submissions")
    
    submissions = await db.quiz_submissions.find(
        {"quiz_id": quiz_id},
        {"_id": 0}
    ).to_list(1000)
    
    return submissions

@api_router.put("/quiz/submission/{submission_id}/feedback")
async def add_quiz_feedback(submission_id: str, feedback: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can add feedback")
    
    result = await db.quiz_submissions.update_one(
        {"id": submission_id},
        {"$set": {"teacher_feedback": feedback}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return {"message": "Feedback added successfully"}

@api_router.get("/quiz/my-submissions")
async def get_my_quiz_submissions(current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can view their submissions")
    
    submissions = await db.quiz_submissions.find(
        {"student_id": current_user.id},
        {"_id": 0}
    ).to_list(1000)
    
    return submissions


# ========== Learning Materials Models ==========
class LearningMaterial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    material_type: Literal["video", "link", "document", "app", "other"]
    class_section: str
    url: Optional[str] = None  # For video links and external URLs
    file_data: Optional[str] = None  # base64 encoded file
    file_name: Optional[str] = None
    uploaded_by: str  # teacher id
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ========== Learning Materials Routes ==========
@api_router.post("/materials/create")
async def create_material(material: LearningMaterial, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can upload materials")
    
    material.uploaded_by = current_user.id
    doc = material.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.learning_materials.insert_one(doc)
    return {"message": "Material uploaded successfully", "material": material}

@api_router.get("/materials/list")
async def list_materials(current_user: User = Depends(get_current_user)):
    if current_user.role == "teacher":
        materials = await db.learning_materials.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    else:
        materials = await db.learning_materials.find(
            {"class_section": current_user.class_section},
            {"_id": 0}
        ).sort("created_at", -1).to_list(1000)
    
    return materials

@api_router.delete("/materials/{material_id}")
async def delete_material(material_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can delete materials")
    
    result = await db.learning_materials.delete_one({"id": material_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Material not found")
    
    return {"message": "Material deleted successfully"}


# ========== School Settings Models ==========
class SchoolRegistration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    school_name: str
    registered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SchoolSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    school_name: str
    updated_by: str  # teacher id
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ========== School Registration Routes ==========
@api_router.post("/school/register")
async def register_school(school: SchoolRegistration):
    # Check if school already registered
    existing = await db.school_registration.find_one({"udise_code": school.udise_code})
    if existing:
        raise HTTPException(status_code=400, detail="School with this UDISE code already registered")
    
    doc = school.model_dump()
    doc["registered_at"] = doc["registered_at"].isoformat()
    
    await db.school_registration.insert_one(doc)
    return {"message": "School registered successfully", "school": school}

@api_router.get("/school/check-registration")
async def check_school_registration():
    school = await db.school_registration.find_one({}, {"_id": 0})
    if not school:
        return {"registered": False}
    return {"registered": True, "school_name": school["school_name"]}


# ========== School Settings Routes ==========
@api_router.get("/settings/school")
async def get_school_settings():
    # First check school registration
    school = await db.school_registration.find_one({}, {"_id": 0})
    if school:
        return {"school_name": school["school_name"]}
    
    # Fallback to old settings
    settings = await db.school_settings.find_one({}, {"_id": 0}, sort=[("updated_at", -1)])
    if not settings:
        return {"school_name": "My School"}
    return {"school_name": settings["school_name"]}

@api_router.put("/settings/school")
async def update_school_settings(school_name: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can update school settings")
    
    settings = SchoolSettings(
        school_name=school_name,
        updated_by=current_user.id
    )
    
    doc = settings.model_dump()
    doc["updated_at"] = doc["updated_at"].isoformat()
    
    await db.school_settings.insert_one(doc)
    
    return {"message": "School name updated successfully", "school_name": school_name}


# ========== Principal Analytics Routes ==========
@api_router.get("/principal/analytics")
async def get_principal_analytics(current_user: User = Depends(get_current_user)):
    if current_user.role != "principal":
        raise HTTPException(status_code=403, detail="Only principals can access analytics")
    
    # Overall statistics
    total_students = await db.users.count_documents({"role": "student"})
    total_teachers = await db.users.count_documents({"role": "teacher"})
    total_homework = await db.homework.count_documents({})
    total_quizzes = await db.quizzes.count_documents({})
    total_materials = await db.learning_materials.count_documents({})
    
    # Attendance statistics
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_attendance = await db.attendance.count_documents({"date": today})
    attendance_percentage = round((today_attendance / total_students * 100) if total_students > 0 else 0, 1)
    
    # Homework submissions
    total_submissions = await db.homework_submissions.count_documents({})
    pending_homework = total_homework * total_students - total_submissions
    
    # Quiz submissions
    total_quiz_submissions = await db.quiz_submissions.count_documents({})
    
    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_homework": total_homework,
        "total_quizzes": total_quizzes,
        "total_materials": total_materials,
        "today_attendance": today_attendance,
        "attendance_percentage": attendance_percentage,
        "total_submissions": total_submissions,
        "pending_homework": max(0, pending_homework),
        "total_quiz_submissions": total_quiz_submissions
    }

@api_router.get("/principal/class-performance")
async def get_class_performance(current_user: User = Depends(get_current_user)):
    if current_user.role != "principal":
        raise HTTPException(status_code=403, detail="Only principals can access this data")
    
    # Get all students grouped by class
    students = await db.users.find({"role": "student"}, {"_id": 0}).to_list(1000)
    
    class_stats = {}
    for student in students:
        class_sec = student.get("class_section", "Unknown")
        if class_sec not in class_stats:
            class_stats[class_sec] = {
                "class_section": class_sec,
                "total_students": 0,
                "attendance_count": 0,
                "homework_submissions": 0,
                "quiz_submissions": 0
            }
        
        class_stats[class_sec]["total_students"] += 1
        
        # Count attendance
        attendance_count = await db.attendance.count_documents({"student_id": student["id"]})
        class_stats[class_sec]["attendance_count"] += attendance_count
        
        # Count homework submissions
        hw_count = await db.homework_submissions.count_documents({"student_id": student["id"]})
        class_stats[class_sec]["homework_submissions"] += hw_count
        
        # Count quiz submissions
        quiz_count = await db.quiz_submissions.count_documents({"student_id": student["id"]})
        class_stats[class_sec]["quiz_submissions"] += quiz_count
    
    return list(class_stats.values())

@api_router.get("/principal/teacher-activity")
async def get_teacher_activity(current_user: User = Depends(get_current_user)):
    if current_user.role != "principal":
        raise HTTPException(status_code=403, detail="Only principals can access this data")
    
    teachers = await db.users.find({"role": "teacher"}, {"_id": 0}).to_list(1000)
    
    teacher_stats = []
    for teacher in teachers:
        # Count created homework
        homework_count = await db.homework.count_documents({"created_by": teacher["id"]})
        
        # Count created quizzes
        quiz_count = await db.quizzes.count_documents({"created_by": teacher["id"]})
        
        # Count uploaded materials
        materials_count = await db.learning_materials.count_documents({"uploaded_by": teacher["id"]})
        
        teacher_stats.append({
            "teacher_name": teacher["full_name"],
            "email": teacher["email"],
            "homework_created": homework_count,
            "quizzes_created": quiz_count,
            "materials_uploaded": materials_count,
            "total_activity": homework_count + quiz_count + materials_count
        })
    
    # Sort by total activity
    teacher_stats.sort(key=lambda x: x["total_activity"], reverse=True)
    
    return teacher_stats

@api_router.get("/principal/attendance-report")
async def get_attendance_report(current_user: User = Depends(get_current_user)):
    if current_user.role != "principal":
        raise HTTPException(status_code=403, detail="Only principals can access this data")
    
    # Get last 7 days attendance
    from datetime import timedelta
    
    report = []
    for i in range(6, -1, -1):
        date = (datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d")
        count = await db.attendance.count_documents({"date": date})
        report.append({
            "date": date,
            "count": count
        })
    
    return report

@api_router.get("/principal/recent-activities")
async def get_recent_activities(current_user: User = Depends(get_current_user)):
    if current_user.role != "principal":
        raise HTTPException(status_code=403, detail="Only principals can access this data")
    
    activities = []
    
    # Recent homework
    homeworks = await db.homework.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    for hw in homeworks:
        teacher = await db.users.find_one({"id": hw.get("created_by")}, {"_id": 0})
        activities.append({
            "type": "homework",
            "title": hw["title"],
            "class_section": hw["class_section"],
            "created_by": teacher["full_name"] if teacher else "Unknown",
            "created_at": hw["created_at"]
        })
    
    # Recent quizzes
    quizzes = await db.quizzes.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    for quiz in quizzes:
        teacher = await db.users.find_one({"id": quiz.get("created_by")}, {"_id": 0})
        activities.append({
            "type": "quiz",
            "title": quiz["title"],
            "class_section": quiz["class_section"],
            "created_by": teacher["full_name"] if teacher else "Unknown",
            "created_at": quiz["created_at"]
        })
    
    # Sort by created_at
    activities.sort(key=lambda x: x["created_at"], reverse=True)
    
    return activities[:10]


# ========== Dashboard Stats ==========
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    if current_user.role == "teacher":
        total_students = await db.users.count_documents({"role": "student"})
        total_homework = await db.homework.count_documents({})
        total_quizzes = await db.quizzes.count_documents({})
        
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        today_attendance = await db.attendance.count_documents({"date": today})
        
        return {
            "total_students": total_students,
            "total_homework": total_homework,
            "total_quizzes": total_quizzes,
            "today_attendance": today_attendance
        }
    else:
        # Student stats
        my_submissions = await db.homework_submissions.count_documents({"student_id": current_user.id})
        my_quiz_submissions = await db.quiz_submissions.count_documents({"student_id": current_user.id})
        my_attendance = await db.attendance.count_documents({"student_id": current_user.id})
        
        pending_homework = await db.homework.count_documents({"class_section": current_user.class_section})
        submitted_homework = await db.homework_submissions.count_documents({"student_id": current_user.id})
        pending = pending_homework - submitted_homework
        
        return {
            "total_submissions": my_submissions,
            "total_quiz_submissions": my_quiz_submissions,
            "attendance_days": my_attendance,
            "pending_homework": max(0, pending)
        }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
