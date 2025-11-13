import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QuizCard } from '@/components/QuizCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw } from 'lucide-react';

export default function PracticePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const questions = [
    {
      question: 'निम्नलिखित में से कौन सा शब्द संज्ञा है?',
      options: ['सुंदर', 'दिल्ली', 'तेज़ी से', 'और'],
      correctAnswer: 'दिल्ली',
      explanation: 'दिल्ली एक स्थान का नाम है, इसलिए यह व्यक्तिवाचक संज्ञा है।'
    },
    {
      question: 'कौन सा शब्द सर्वनाम है?',
      options: ['किताब', 'वह', 'सुंदर', 'दौड़ना'],
      correctAnswer: 'वह',
      explanation: 'वह संज्ञा के स्थान पर प्रयोग होता है, इसलिए यह सर्वनाम है।'
    },
    {
      question: 'लड़का खेल रहा है - इस वाक्य में क्रिया कौन सी है?',
      options: ['लड़का', 'खेल रहा है', 'है', 'खेल'],
      correctAnswer: 'खेल रहा है',
      explanation: 'खेल रहा है काम करने का बोध करा रहा है, इसलिए यह क्रिया है।'
    },
    {
      question: 'सुंदर लड़की - इस वाक्य में विशेषण कौन सा है?',
      options: ['सुंदर', 'लड़की', 'सुंदर लड़की', 'कोई नहीं'],
      correctAnswer: 'सुंदर',
      explanation: 'सुंदर लड़की की विशेषता बता रहा है, इसलिए यह विशेषण है।'
    },
    {
      question: 'निम्नलिखित में से कौन सा शब्द भाववाचक संज्ञा है?',
      options: ['गंगा', 'मित्रता', 'आम', 'टीम'],
      correctAnswer: 'मित्रता',
      explanation: 'मित्रता एक भाव है, इसलिए यह भाववाचक संज्ञा है।'
    }
  ];
  
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsCompleted(true);
      }
    }, 2000);
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsCompleted(false);
  };
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const percentage = Math.round((score / questions.length) * 100);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-foreground hindi-text">
            अभ्यास प्रश्न
          </h1>
          <p className="text-lg text-muted-foreground hindi-text">
            अपने ज्ञान का परीक्षण करें
          </p>
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
            
            {/* Question Card */}
            <QuizCard 
              question={questions[currentQuestionIndex]} 
              onAnswer={handleAnswer}
            />
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
            
            <Button onClick={handleRestart} size="lg" className="hindi-text group">
              <RotateCcw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
              फिर से शुरू करें
            </Button>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
}