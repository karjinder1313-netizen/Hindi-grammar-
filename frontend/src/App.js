import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import AuthPage from "@/pages/AuthPage";
import TeacherDashboard from "@/pages/TeacherDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import PrincipalDashboard from "@/pages/PrincipalDashboard";
import SchoolRegistration from "@/pages/SchoolRegistration";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Axios interceptor for auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schoolRegistered, setSchoolRegistered] = useState(false);

  useEffect(() => {
    checkSchoolRegistration();
    checkAuth();
  }, []);

  const checkSchoolRegistration = async () => {
    try {
      const response = await axios.get(`${API}/school/check-registration`);
      setSchoolRegistered(response.data.registered);
    } catch (error) {
      console.error("Failed to check school registration");
      setSchoolRegistered(false);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${API}/auth/me`);
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  const handleRegistrationComplete = () => {
    setSchoolRegistered(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === "teacher" ? (
                  <Navigate to="/teacher" replace />
                ) : user.role === "principal" ? (
                  <Navigate to="/principal" replace />
                ) : (
                  <Navigate to="/student" replace />
                )
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/auth"
            element={
              user ? (
                <Navigate
                  to={user.role === "teacher" ? "/teacher" : user.role === "principal" ? "/principal" : "/student"}
                  replace
                />
              ) : (
                <AuthPage setUser={setUser} />
              )
            }
          />
          <Route
            path="/teacher/*"
            element={
              user && user.role === "teacher" ? (
                <TeacherDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/student/*"
            element={
              user && user.role === "student" ? (
                <StudentDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/principal/*"
            element={
              user && user.role === "principal" ? (
                <PrincipalDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
