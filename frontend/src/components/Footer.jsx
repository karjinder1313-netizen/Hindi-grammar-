import { BookOpen, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <ul className="space-y-2 text-sm text-muted-foreground hindi-text">
              <li>पाठ</li>
              <li>अभ्यास</li>
              <li>प्रगति</li>
              <li>सहायता</li>
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