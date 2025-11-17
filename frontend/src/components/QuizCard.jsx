import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

export const QuizCard = ({ question, onAnswer, onCheckAnswer, onRepeatQuestion }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
  }, [question]);
  
  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast.error('कृपया एक विकल्प चुनें');
      return;
    }
    
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      toast.success('सही उत्तर! 🎉');
    }
    // Removed: toast.error for wrong answers - feedback shown in card instead
    
    // Auto-play explanation audio
    if (onCheckAnswer) {
      setTimeout(() => {
        onCheckAnswer();
      }, 500);
    }
    
    onAnswer(correct);
  };
  
  const handleNext = () => {
    setSelectedAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
  };
  
  return (
    <Card className="p-6 space-y-6 animate-scale-in">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 hindi-text">
          {question.question}
        </h3>
        
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={isAnswered}>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className={`flex-grow cursor-pointer p-3 rounded-lg border transition-all ${
                    isAnswered && option === question.correctAnswer
                      ? 'border-success bg-success/10'
                      : isAnswered && option === selectedAnswer && !isCorrect
                      ? 'border-destructive bg-destructive/10'
                      : 'border-border hover:border-primary'
                  } hindi-text`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
      
      {isAnswered && (
        <div className={`p-4 rounded-lg border ${
          isCorrect 
            ? 'border-success bg-success/10' 
            : 'border-destructive bg-destructive/10'
        } animate-fade-in`}>
          <div className="flex items-start space-x-3">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
            )}
            <div>
              <p className="font-medium hindi-text">
                {isCorrect ? 'बहुत बढ़िया!' : 'सही उत्तर:'}
              </p>
              {!isCorrect && (
                <p className="text-sm mt-1 hindi-text">{question.correctAnswer}</p>
              )}
              {question.explanation && (
                <p className="text-sm text-muted-foreground mt-2 hindi-text">
                  {question.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        {isAnswered && onRepeatQuestion && (
          <Button 
            onClick={onRepeatQuestion} 
            variant="outline"
            className="hindi-text group"
          >
            <RotateCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            प्रश्न दोहराएं
          </Button>
        )}
        {!isAnswered && <div></div>}
        <Button onClick={handleSubmit} disabled={isAnswered} className="hindi-text">
          जाँचें
        </Button>
      </div>
    </Card>
  );
};