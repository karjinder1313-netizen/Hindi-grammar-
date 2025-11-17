import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, ArrowRight } from 'lucide-react';
import practiceExercises from '@/data/questionBank';

export default function PracticeExercisesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <Target className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold text-foreground hindi-text">
              अभ्यास श्रृंखला
            </h1>
          </div>
          <p className="text-lg text-muted-foreground hindi-text">
            10 अभ्यास श्रृंखलाएँ, प्रत्येक में 100 प्रश्न
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="hindi-text">कुल प्रश्न: 1000</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="hindi-text">विषय: सभी व्याकरण</span>
            </div>
          </div>
        </div>
        
        {/* Exercise Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceExercises.map((exercise, index) => (
            <Card 
              key={exercise.id}
              className="card-interactive flex flex-col"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl">
                  {exercise.icon}
                </div>
                <Badge 
                  variant="outline" 
                  className={`hindi-text ${
                    exercise.difficulty === 'आसान' 
                      ? 'border-success text-success' 
                      : exercise.difficulty === 'मध्यम'
                      ? 'border-primary text-primary'
                      : 'border-destructive text-destructive'
                  }`}
                >
                  {exercise.difficulty}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 hindi-text">
                {exercise.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 flex-grow hindi-text">
                {exercise.description}
              </p>
              
              <div className="space-y-4 mt-auto">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground hindi-text">कुल प्रश्न</span>
                  <span className="font-bold text-foreground">{exercise.totalQuestions}</span>
                </div>
                
                <Button asChild className="w-full group">
                  <Link 
                    to={`/practice/${exercise.id}`}
                    className="flex items-center justify-center space-x-2"
                  >
                    <span className="hindi-text">अभ्यास शुरू करें</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="text-4xl font-bold gradient-text mb-2">1000</div>
            <p className="text-sm text-muted-foreground hindi-text">कुल प्रश्न</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <div className="text-4xl font-bold gradient-text mb-2">10</div>
            <p className="text-sm text-muted-foreground hindi-text">अभ्यास श्रृंखला</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-success/10 to-accent/10 border-success/20">
            <div className="text-4xl font-bold gradient-text mb-2">12</div>
            <p className="text-sm text-muted-foreground hindi-text">व्याकरण विषय</p>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
