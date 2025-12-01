import { BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                हि
              </div>
              <span className="text-xl font-bold text-foreground hindi-text">हिंदी व्याकरण</span>
            </div>
            <p className="text-sm text-muted-foreground hindi-text">
              हिंदी व्याकरण सीखने का सबसे आसान तरीका
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 hindi-text">त्वरित लिंक</h3>
            <ul className="space-y-2 text-sm hindi-text">
              <li>
                <Link to="/lessons" className="text-muted-foreground hover:text-foreground transition-colors">
                  पाठ
                </Link>
              </li>
              <li>
                <Link to="/practice" className="text-muted-foreground hover:text-foreground transition-colors">
                  अभ्यास
                </Link>
              </li>
              <li>
                <Link to="/progress" className="text-muted-foreground hover:text-foreground transition-colors">
                  प्रगति
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
                  सहायता
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 hindi-text">कानूनी</h3>
            <ul className="space-y-2 text-sm hindi-text">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  गोपनीयता नीति
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  सेवा की शर्तें
                </Link>
              </li>
            </ul>
            <ul className="space-y-2 text-sm mt-4">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 hindi-text">हमारे बारे में</h3>
            <p className="text-sm text-muted-foreground hindi-text">
              यह एप्लिकेशन हिंदी व्याकरण को मजेदार और इंटरैक्टिव तरीके से सीखने में मदद करता है।
            </p>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground flex items-center space-x-1">
            <span className="hindi-text">बनाया गया</span>
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="hindi-text">के साथ</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            © 2024 Hindi Grammar App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};