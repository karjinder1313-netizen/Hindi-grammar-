import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LessonCard } from '@/components/LessonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const lessons = [
    {
      id: 1,
      title: 'संज्ञा (Noun)',
      description: 'व्यक्ति, स्थान, या वस्तु के नाम को संज्ञा कहते हैं',
      difficulty: 'आसान',
      duration: 15,
      completed: true,
      icon: '📝'
    },
    {
      id: 2,
      title: 'सर्वनाम (Pronoun)',
      description: 'संज्ञा के स्थान पर प्रयोग होने वाले शब्द',
      difficulty: 'आसान',
      duration: 20,
      completed: true,
      icon: '👤'
    },
    {
      id: 3,
      title: 'क्रिया (Verb)',
      description: 'काम करने या होने का बोध कराने वाले शब्द',
      difficulty: 'मध्यम',
      duration: 25,
      completed: false,
      icon: '🏃'
    },
    {
      id: 4,
      title: 'विशेषण (Adjective)',
      description: 'संज्ञा या सर्वनाम की विशेषता बताने वाले शब्द',
      difficulty: 'मध्यम',
      duration: 20,
      completed: false,
      icon: '✨'
    },
    {
      id: 5,
      title: 'क्रिया विशेषण (Adverb)',
      description: 'क्रिया की विशेषता बताने वाले शब्द',
      difficulty: 'मध्यम',
      duration: 20,
      completed: false,
      icon: '⚡'
    },
    {
      id: 6,
      title: 'वचन (Number)',
      description: 'एक या अनेक का बोध कराने वाले रूप',
      difficulty: 'आसान',
      duration: 15,
      completed: false,
      icon: '🔢'
    },
    {
      id: 7,
      title: 'लिंग (Gender)',
      description: 'स्त्रीलिंग, पुल्लिंग और नपुंसकलिंग',
      difficulty: 'आसान',
      duration: 15,
      completed: false,
      icon: '⚥'
    },
    {
      id: 8,
      title: 'कारक (Case)',
      description: 'संज्ञा या सर्वनाम का क्रिया से संबंध',
      difficulty: 'कठिन',
      duration: 30,
      completed: false,
      icon: '🔗'
    },
    {
      id: 9,
      title: 'काल (Tense)',
      description: 'भूत, वर्तमान और भविष्य काल',
      difficulty: 'कठिन',
      duration: 30,
      completed: false,
      icon: '⏰'
    },
    {
      id: 10,
      title: 'समास (Compound)',
      description: 'दो या अधिक शब्दों से मिलकर बने नए शब्द',
      difficulty: 'कठिन',
      duration: 35,
      completed: false,
      icon: '🔀'
    },
    {
      id: 11,
      title: 'संधि (Sandhi)',
      description: 'दो वर्णों के मेल से होने वाला विकार',
      difficulty: 'कठिन',
      duration: 35,
      completed: false,
      icon: '🔤'
    },
    {
      id: 12,
      title: 'विलोम शब्द (Antonyms)',
      description: 'विपरीत अर्थ वाले शब्द',
      difficulty: 'मध्यम',
      duration: 20,
      completed: false,
      icon: '↔️'
    }
  ];
  
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4 hindi-text">
              सभी पाठ
            </h1>
            <p className="text-lg text-muted-foreground hindi-text">
              अपनी गति से हिंदी व्याकरण सीखें
            </p>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="पाठ खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 hindi-text"
            />
          </div>
        </div>
        
        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <div 
              key={lesson.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
        
        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground hindi-text">
              कोई पाठ नहीं मिला
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}