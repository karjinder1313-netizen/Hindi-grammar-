import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, Target, TrendingUp, MessageCircle } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl transition-transform duration-300 group-hover:scale-110">
              हि
            </div>
            <span className="text-xl font-bold text-foreground hindi-text">हिंदी व्याकरण</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>होम</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/lessons') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/lessons" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>पाठ</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/practice') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/practice" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>अभ्यास</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/chat') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/chat" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>AI सहायक</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/progress') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/progress" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>प्रगति</span>
              </Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/lessons">
              <BookOpen className="h-6 w-6 text-foreground" />
            </Link>
            <Link to="/chat">
              <MessageCircle className="h-6 w-6 text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};