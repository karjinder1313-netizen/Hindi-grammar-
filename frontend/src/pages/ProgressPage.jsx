import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProgressCard } from '@/components/ProgressCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Award, TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  const stats = [
    {
      title: 'पूर्ण किए गए पाठ',
      completed: 2,
      total: 12,
      icon: BookOpen,
      color: 'primary'
    },
    {
      title: 'अभ्यास प्रश्न',
      completed: 45,
      total: 100,
      icon: Target,
      color: 'accent'
    },
    {
      title: 'अर्जित बैज',
      completed: 3,
      total: 10,
      icon: Award,
      color: 'success'
    }
  ];
  
  const recentActivity = [
    {
      title: 'संज्ञा',
      type: 'पाठ',
      date: '2 दिन पहले',
      status: 'पूर्ण'
    },
    {
      title: 'सर्वनाम',
      type: 'पाठ',
      date: '3 दिन पहले',
      status: 'पूर्ण'
    },
    {
      title: 'व्याकरण अभ्यास',
      type: 'अभ्यास',
      date: '5 दिन पहले',
      status: 'पूर्ण'
    }
  ];
  
  const achievements = [
    {
      icon: '🏆',
      title: 'पहला कदम',
      description: 'पहला पाठ पूर्ण किया',
      earned: true
    },
    {
      icon: '🎯',
      title: 'अभ्यासी',
      description: '50 प्रश्न सही किए',
      earned: false
    },
    {
      icon: '📚',
      title: 'विद्वान',
      description: '10 पाठ पूर्ण किए',
      earned: false
    },
    {
      icon: '🌟',
      title: 'परफेक्ट स्कोर',
      description: '100% स्कोर प्राप्त किया',
      earned: true
    },
    {
      icon: '🔥',
      title: '7 दिन की लकीर',
      description: 'लगातार 7 दिन अभ्यास',
      earned: false
    },
    {
      icon: '💪',
      title: 'कठिन मास्टर',
      description: 'सभी कठिन पाठ पूर्ण किए',
      earned: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 hindi-text">
            आपकी प्रगति
          </h1>
          <p className="text-lg text-muted-foreground hindi-text">
            अपनी सीखने की यात्रा को ट्रैक करें
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProgressCard {...stat} />
            </div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6 hindi-text">
              हाल की गतिविधि
            </h2>
            <Card className="p-6 space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground hindi-text">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground hindi-text">
                      {activity.type} • {activity.date}
                    </p>
                  </div>
                  <Badge className="bg-success text-success-foreground hindi-text">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </Card>
          </div>
          
          {/* Achievements */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6 hindi-text">
              उपलब्धियां
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index} 
                  className={`p-6 space-y-3 text-center transition-all duration-300 hover:shadow-md ${
                    achievement.earned ? 'border-primary' : 'opacity-50'
                  }`}
                >
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground hindi-text">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 hindi-text">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-primary text-primary-foreground hindi-text">
                      अर्जित
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Weekly Goal */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                साप्ताहिक लक्ष्य
              </h2>
              <p className="text-muted-foreground hindi-text">
                इस सप्ताह 5 पाठ पूर्ण करें
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold gradient-text">
                2/5
              </div>
              <p className="text-sm text-muted-foreground mt-1 hindi-text">
                पाठ पूर्ण
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}