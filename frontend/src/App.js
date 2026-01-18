import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LessonsPage from '@/pages/LessonsPage';
import LessonDetailPage from '@/pages/LessonDetailPage';
import PracticeExercisesPage from '@/pages/PracticeExercisesPage';
import PracticePage from '@/pages/PracticePage';
import ProgressPage from '@/pages/ProgressPage';
import ChatPage from '@/pages/ChatPage';
import SearchPage from '@/pages/SearchPage';
import FlashcardsPage from '@/pages/FlashcardsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import AuthPage from '@/pages/AuthPage';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/lessons" element={<ProtectedRoute><LessonsPage /></ProtectedRoute>} />
            <Route path="/lesson/:lessonId" element={<ProtectedRoute><LessonDetailPage /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><PracticeExercisesPage /></ProtectedRoute>} />
            <Route path="/practice/:exerciseId" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;