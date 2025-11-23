import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Users, BookOpen, ClipboardList, Calendar, Home, TrendingUp, Activity, Library } from "lucide-react";

const PrincipalDashboard = ({ user, onLogout }) => {
  const [analytics, setAnalytics] = useState(null);
  const [classPerformance, setClassPerformance] = useState([]);
  const [teacherActivity, setTeacherActivity] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [schoolName, setSchoolName] = useState("My School");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAllData();
    fetchSchoolName();
  }, []);

  const fetchSchoolName = async () => {
    try {
      const response = await axios.get(`${API}/settings/school`);
      setSchoolName(response.data.school_name);
    } catch (error) {
      console.error("Failed to load school name");
    }
  };

  const fetchAllData = async () => {
    try {
      const [analyticsRes, classRes, teacherRes, attendanceRes, activitiesRes] = await Promise.all([
        axios.get(`${API}/principal/analytics`),
        axios.get(`${API}/principal/class-performance`),
        axios.get(`${API}/principal/teacher-activity`),
        axios.get(`${API}/principal/attendance-report`),
        axios.get(`${API}/principal/recent-activities`)
      ]);
      
      setAnalytics(analyticsRes.data);
      setClassPerformance(classRes.data);
      setTeacherActivity(teacherRes.data);
      setAttendanceReport(attendanceRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-200 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{schoolName}</h1>
              <p className="text-sm text-gray-600">Principal Portal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">Principal</p>
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
        <Routes>
          <Route path="/" element={
            <div>
              <h2 className="text-2xl font-bold mb-6">School Overview</h2>

              {/* Main Statistics */}
              {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Total Students</CardTitle>
                      <Users className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.total_students}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Total Teachers</CardTitle>
                      <Users className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.total_teachers}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Homework</CardTitle>
                      <BookOpen className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.total_homework}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Quizzes</CardTitle>
                      <ClipboardList className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.total_quizzes}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-0 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-white/90">Materials</CardTitle>
                      <Library className="w-5 h-5 text-white" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analytics.total_materials}</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Attendance Overview */}
              {analytics && (
                <Card className="mb-8 border-0 bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      Today's Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold">{analytics.today_attendance}</div>
                        <p className="text-white/90 mt-1">students present</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold">{analytics.attendance_percentage}%</div>
                        <p className="text-white/90 mt-1">attendance rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Class Performance */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Class Performance
                    </CardTitle>
                    <CardDescription>Student engagement by class</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classPerformance.map((cls) => (
                        <div key={cls.class_section} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Class {cls.class_section}</h4>
                            <Badge>{cls.total_students} students</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Attendance</p>
                              <p className="font-bold text-green-600">{cls.attendance_count}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Homework</p>
                              <p className="font-bold text-blue-600">{cls.homework_submissions}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Quizzes</p>
                              <p className="font-bold text-purple-600">{cls.quiz_submissions}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {classPerformance.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No class data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Teacher Activity */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Teacher Activity
                    </CardTitle>
                    <CardDescription>Content creation overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teacherActivity.slice(0, 5).map((teacher) => (
                        <div key={teacher.email} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{teacher.teacher_name}</h4>
                              <p className="text-xs text-gray-500">{teacher.email}</p>
                            </div>
                            <Badge variant="outline">
                              {teacher.total_activity} activities
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                            <div>
                              <p className="text-gray-600">Homework</p>
                              <p className="font-bold text-blue-600">{teacher.homework_created}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Quizzes</p>
                              <p className="font-bold text-purple-600">{teacher.quizzes_created}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Materials</p>
                              <p className="font-bold text-green-600">{teacher.materials_uploaded}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {teacherActivity.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No teacher activity yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Trend */}
              <Card className="mb-8 shadow-lg">
                <CardHeader>
                  <CardTitle>Weekly Attendance Trend</CardTitle>
                  <CardDescription>Last 7 days attendance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-48">
                    {attendanceReport.map((day) => {
                      const maxCount = Math.max(...attendanceReport.map(d => d.count), 1);
                      const height = (day.count / maxCount) * 100;
                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center">
                          <div className="text-xs font-bold mb-1">{day.count}</div>
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs mt-2 text-gray-600">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest homework and quizzes created</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${activity.type === 'homework' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                          {activity.type === 'homework' ? (
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ClipboardList className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{activity.title}</h4>
                              <p className="text-sm text-gray-600">
                                By {activity.created_by} • Class {activity.class_section}
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentActivities.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No recent activities</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
