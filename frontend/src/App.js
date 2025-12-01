import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lesson/:lessonId" element={<LessonDetailPage />} />
          <Route path="/practice" element={<PracticeExercisesPage />} />
          <Route path="/practice/:exerciseId" element={<PracticePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;