import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { BookOpen, Target, TrendingUp, Award, Users, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'व्यापक पाठ',
      description: 'संज्ञा से लेकर क्रिया तक, सभी व्याकरण विषयों को कवर करता है'
    },
    {
      icon: Target,
      title: 'इंटरैक्टिव अभ्यास',
      description: 'वास्तविक समय में प्रतिक्रिया के साथ अपने ज्ञान का परीक्षण करें'
    },
    {
      icon: TrendingUp,
      title: 'प्रगति ट्रैकिंग',
      description: 'अपनी सीखने की यात्रा को ट्रैक करें और अपने लक्ष्यों को प्राप्त करें'
    },
    {
      icon: Award,
      title: 'उपलब्धियां',
      description: 'पाठ पूरा करें और बैज अर्जित करें'
    }
  ];
  
  const stats = [
    { value: '50+', label: 'पाठ' },
    { value: '500+', label: 'अभ्यास प्रश्न' },
    { value: '10K+', label: 'छात्र' },
    { value: '4.8★', label: 'रेटिंग' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <Badge className="bg-secondary text-secondary-foreground inline-flex items-center space-x-2 px-4 py-2">
              <Star className="h-4 w-4" />
              <span className="hindi-text">मुफ्त में सीखें</span>
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight hindi-text">
              हिंदी व्याकरण को
              <span className="block mt-2 gradient-text">
                मजेदार तरीके से सीखें
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground hindi-text leading-relaxed">
              इंटरैक्टिव पाठों, अभ्यास प्रश्नों और वास्तविक समय की प्रतिक्रिया के साथ अपने हिंदी व्याकरण कौशल में सुधार करें।
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="group">
                <Link to="/lessons" className="flex items-center space-x-2">
                  <span className="hindi-text">अभी शुरू करें</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/practice" className="hindi-text">
                  अभ्यास करें
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 hindi-text">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-card rounded-2xl p-8 border border-border shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl">
                    📚
                  </div>
                  <div className="flex-grow">
                    <div className="h-4 bg-muted-foreground/20 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-muted-foreground/10 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-2xl">
                    ✏️
                  </div>
                  <div className="flex-grow">
                    <div className="h-4 bg-muted-foreground/20 rounded w-40 mb-2"></div>
                    <div className="h-3 bg-muted-foreground/10 rounded w-28"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-success to-accent flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <div className="flex-grow">
                    <div className="h-4 bg-muted-foreground/20 rounded w-36 mb-2"></div>
                    <div className="h-3 bg-muted-foreground/10 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 hindi-text">
            क्यों चुनें हमें?
          </h2>
          <p className="text-lg text-muted-foreground hindi-text">
            सीखने को आसान और प्रभावी बनाने वाली सुविधाएं
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground hindi-text">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground hindi-text flex-grow">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-primary to-secondary p-12 text-center text-white border-0 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 hindi-text">
            आज ही अपनी यात्रा शुरू करें
          </h2>
          <p className="text-lg mb-8 text-white/90 hindi-text">
            हिंदी व्याकरण में महारत हासिल करने के लिए हजारों छात्रों के साथ जुड़ें
          </p>
          <Button size="lg" variant="secondary" asChild className="group">
            <Link to="/lessons" className="flex items-center space-x-2">
              <span className="hindi-text">पाठ देखें</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </Card>
      </section>
      
      <Footer />
    </div>
  );
}