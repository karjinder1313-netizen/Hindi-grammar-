import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QuizCard } from '@/components/QuizCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import practiceExercises from '@/data/questionBank';
import { useSpeech } from '@/hooks/useSpeech';
import { AudioControls } from '@/components/AudioControls';

export default function PracticePage() {
  const { exerciseId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { speak, pause, resume, stop, isPlaying, isPaused, rate, changeRate } = useSpeech();
  
  // Get exercise or default to first one
  const exercise = practiceExercises.find(ex => ex.id === parseInt(exerciseId)) || practiceExercises[0];
  const questions = exercise.questions;
  
  // Stop audio when question changes
  useEffect(() => {
    stop();
  }, [currentQuestionIndex, stop]);
  
  const handlePlay = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const textToSpeak = [
      `प्रश्न ${currentQuestionIndex + 1}`,
      currentQuestion.question,
      'विकल्प',
      ...currentQuestion.options
    ];
    speak(textToSpeak);
  };
  
  const handlePlayExplanation = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const textToSpeak = [
      'सही उत्तर',
      currentQuestion.correctAnswer,
      'व्याख्या',
      currentQuestion.explanation
    ];
    speak(textToSpeak);
  };
  
  const handleRepeatQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const textToSpeak = [
      `प्रश्न ${currentQuestionIndex + 1}`,
      currentQuestion.question,
      'विकल्प',
      ...currentQuestion.options,
      'सही उत्तर',
      currentQuestion.correctAnswer,
      'व्याख्या',
      currentQuestion.explanation
    ];
    speak(textToSpeak);
  };
  
  const handleTryAgain = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const textToSpeak = [
      `प्रश्न ${currentQuestionIndex + 1}`,
      currentQuestion.question,
      'विकल्प',
      ...currentQuestion.options
    ];
    speak(textToSpeak);
  };
  
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    // Don't auto-advance - let user click next button after checking answer
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsCompleted(false);
  };
  
  const goToLastQuestion = () => {
    stop();
    setCurrentQuestionIndex(questions.length - 1);
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      stop();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      stop();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const percentage = Math.round((score / questions.length) * 100);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/practice" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hindi-text">सभी अभ्यास</span>
          </Link>
        </Button>
        
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl">
              {exercise.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground hindi-text">
                {exercise.title}
              </h1>
              <p className="text-sm text-muted-foreground hindi-text">
                {exercise.description}
              </p>
            </div>
          </div>
        </div>
        
        {!isCompleted ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground hindi-text">
                  प्रश्न {currentQuestionIndex + 1} / {questions.length}
                </span>
                <Badge className="bg-primary text-primary-foreground">
                  स्कोर: {score}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </Card>
            
            {/* Audio Controls */}
            <AudioControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              onPlay={handlePlay}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              rate={rate}
              onRateChange={changeRate}
            />
            
            {/* Question Card */}
            <QuizCard 
              question={questions[currentQuestionIndex]} 
              onAnswer={handleAnswer}
              onCheckAnswer={handlePlayExplanation}
              onRepeatQuestion={handleRepeatQuestion}
            />
            
            {/* Navigation Buttons */}
            <Card className="p-4">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="hindi-text"
                >
                  पिछला प्रश्न
                </Button>
                
                <Button
                  variant="outline"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="hindi-text"
                >
                  अगला प्रश्न
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          /* Results */
          <Card className="p-8 space-y-6 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mx-auto">
              <Trophy className="h-10 w-10" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2 hindi-text">
                बधाई हो!
              </h2>
              <p className="text-lg text-muted-foreground hindi-text">
                आपने अभ्यास पूरा कर लिया
              </p>
            </div>
            
            <div className="py-8 space-y-4">
              <div className="text-6xl font-bold gradient-text">
                {percentage}%
              </div>
              <p className="text-lg text-muted-foreground hindi-text">
                {score} सही उत्तर, {questions.length} में से
              </p>
            </div>
            
            <div className="p-6 bg-muted rounded-xl">
              <p className="text-base text-foreground hindi-text">
                {percentage >= 80 
                  ? 'बहुत बढ़िया! आप हिंदी व्याकरण में माहिर हैं।'
                  : percentage >= 60
                  ? 'अच्छा प्रयास! थोड़ा और अभ्यास करें।'
                  : 'फिर से कोशिश करें और ज्यादा अभ्यास करें।'
                }
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleRestart} size="lg" className="hindi-text group flex-1">
                <RotateCcw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                फिर से शुरू करें
              </Button>
              <Button variant="outline" size="lg" asChild className="hindi-text flex-1">
                <Link to="/practice">
                  सभी अभ्यास
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
}