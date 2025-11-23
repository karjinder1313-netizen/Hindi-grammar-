import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Users, BookOpen, ClipboardList, Calendar, Home, Plus } from "lucide-react";
import CreateHomework from "@/components/CreateHomework";
import CreateQuiz from "@/components/CreateQuiz";
import HomeworkList from "@/components/HomeworkList";
import QuizList from "@/components/QuizList";
import AttendanceView from "@/components/AttendanceView";

const TeacherDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">GSSSS BASTI JODHEWAL</h1>
              <p className="text-sm text-gray-600">Teacher Portal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">Teacher</p>
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
            variant={isActive('/teacher') && location.pathname === '/teacher' ? "default" : "outline"}
            onClick={() => navigate('/teacher')}
            data-testid="nav-home"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant={isActive('/homework') ? "default" : "outline"}
            onClick={() => navigate('/teacher/homework')}
            data-testid="nav-homework"
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Homework
          </Button>
          <Button
            variant={isActive('/quiz') ? "default" : "outline"}
            onClick={() => navigate('/teacher/quiz')}
            data-testid="nav-quiz"
            className="flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            Quizzes
          </Button>
          <Button
            variant={isActive('/attendance') ? "default" : "outline"}
            onClick={() => navigate('/teacher/attendance')}
            data-testid="nav-attendance"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Attendance
          </Button>
        </div>

        <Routes>
          <Route path="/" element={
            <div>
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card data-testid="stat-students">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                      <Users className="w-5 h-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.total_students}</div>
                    </CardContent>
                  </Card>
                  <Card data-testid="stat-homework">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Homework Assigned</CardTitle>
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.total_homework}</div>
                    </CardContent>
                  </Card>
                  <Card data-testid="stat-quizzes">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Quizzes Created</CardTitle>
                      <ClipboardList className="w-5 h-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.total_quizzes}</div>
                    </CardContent>
                  </Card>
                  <Card data-testid="stat-attendance">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Today's Attendance</CardTitle>
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.today_attendance}</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your class efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => navigate('/teacher/homework/create')}
                      data-testid="quick-create-homework"
                      className="h-24 flex flex-col gap-2"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Create Homework</span>
                    </Button>
                    <Button
                      onClick={() => navigate('/teacher/quiz/create')}
                      data-testid="quick-create-quiz"
                      className="h-24 flex flex-col gap-2"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Create Quiz</span>
                    </Button>
                    <Button
                      onClick={() => navigate('/teacher/attendance')}
                      data-testid="quick-view-attendance"
                      className="h-24 flex flex-col gap-2"
                    >
                      <Calendar className="w-6 h-6" />
                      <span>View Attendance</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          } />
          <Route path="/homework" element={<HomeworkList role="teacher" />} />
          <Route path="/homework/create" element={<CreateHomework />} />
          <Route path="/quiz" element={<QuizList role="teacher" />} />
          <Route path="/quiz/create" element={<CreateQuiz />} />
          <Route path="/attendance" element={<AttendanceView />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherDashboard;
