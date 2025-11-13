import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LessonCard = ({ lesson }) => {
  const { id, title, description, difficulty, duration, completed, icon } = lesson;
  
  return (
    <Card className="card-interactive flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl">
          {icon}
        </div>
        {completed && (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            पूर्ण
          </Badge>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2 hindi-text">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4 flex-grow hindi-text">
        {description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline" className="text-xs hindi-text">
          {difficulty}
        </Badge>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{duration} मिनट</span>
        </div>
      </div>
      
      <Button asChild className="w-full mt-auto">
        <Link to={`/lesson/${id}`} className="flex items-center justify-center space-x-2">
          <BookOpen className="h-4 w-4" />
          <span className="hindi-text">पाठ शुरू करें</span>
        </Link>
      </Button>
    </Card>
  );
};