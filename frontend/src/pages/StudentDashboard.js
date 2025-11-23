import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, BookOpen, ClipboardList, Calendar, Home, CheckCircle, Library } from "lucide-react";
import HomeworkList from "@/components/HomeworkList";
import QuizList from "@/components/QuizList";
import MyAttendance from "@/components/MyAttendance";
import LearningMaterials from "@/components/LearningMaterials";
import { getErrorMessage } from "@/utils/errorHandler";

const StudentDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [schoolName, setSchoolName] = useState("My School");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchStats();
    checkAttendance();
    fetchSchoolName();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    }
  };

  const fetchSchoolName = async () => {
    try {
      const response = await axios.get(`${API}/settings/school`);
      setSchoolName(response.data.school_name);
    } catch (error) {
      console.error("Failed to load school name");
    }
  };

  const checkAttendance = async () => {
    try {
      const response = await axios.get(`${API}/attendance/today-status`);
      setAttendanceStatus(response.data);
    } catch (error) {
      console.error("Failed to check attendance");
    }
  };

  const markAttendance = async () => {
    try {
      await axios.post(`${API}/attendance/mark`);
      toast.success("Attendance marked successfully!");
      checkAttendance();
      fetchStats();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{schoolName}</h1>
              <p className="text-sm text-gray-600">Student Portal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">Class {user.class_section}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout} data-testid="logout-btn">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={isActive('/student') && location.pathname === '/student' ? "default" : "outline"}
            onClick={() => navigate('/student')}
            data-testid="nav-home"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant={isActive('/homework') ? "default" : "outline"}
            onClick={() => navigate('/student/homework')}
            data-testid="nav-homework"
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Homework
          </Button>
          <Button
            variant={isActive('/quiz') ? "default" : "outline"}
            onClick={() => navigate('/student/quiz')}
            data-testid="nav-quiz"
            className="flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            Quizzes
          </Button>
          <Button
            variant={isActive('/attendance') ? "default" : "outline"}
            onClick={() => navigate('/student/attendance')}
            data-testid="nav-attendance"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Attendance
          </Button>
          <Button
            variant={isActive('/materials') ? "default" : "outline"}
            onClick={() => navigate('/student/materials')}
            data-testid="nav-materials"
            className="flex items-center gap-2"
          >
            <Library className="w-4 h-4" />
            Materials
          </Button>
        </div>

        <Routes>
          <Route path="/" element={
            <div>
              {/* Attendance Card */}
              {attendanceStatus && (
                <Card className="mb-6 border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-white">Daily Attendance</h3>
                          <p className="text-sm text-white/90">
                            {attendanceStatus.marked_today
                              ? "You've marked your attendance for today"
                              : "Don't forget to mark your attendance"}
                          </p>
                        </div>
                      </div>
                      {!attendanceStatus.marked_today && (
                        <Button
                          onClick={markAttendance}
                          data-testid="mark-attendance-btn"
                          className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Present
                        </Button>
                      )}
                      {attendanceStatus.marked_today && (
                        <Badge className="bg-white text-purple-600">Marked ✓</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card data-testid="stat-attendance" className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Attendance Days</CardTitle>
                      <Calendar className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.attendance_days}</div>
                    </CardContent>
                  </Card>
                  <Card data-testid="stat-homework-submissions" className="bg-gradient-to-br from-green-500 to-teal-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Homework Submitted</CardTitle>
                      <BookOpen className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.total_submissions}</div>
                    </CardContent>
                  </Card>
                  <Card data-testid="stat-pending-homework" className="bg-gradient-to-br from-orange-500 to-amber-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Pending Homework</CardTitle>
                      <BookOpen className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.pending_homework}</div>
                    </CardContent>
                  </Card>
                  <Card data-testid="stat-quiz-submissions" className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Quizzes Completed</CardTitle>
                      <ClipboardList className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.total_quiz_submissions}</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back!</CardTitle>
                  <CardDescription>Stay on top of your assignments and quizzes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Your Class</h4>
                        <p className="text-sm text-gray-600">Class {user.class_section}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          } />
          <Route path="/homework" element={<HomeworkList role="student" />} />
          <Route path="/quiz" element={<QuizList role="student" />} />
          <Route path="/attendance" element={<MyAttendance />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
