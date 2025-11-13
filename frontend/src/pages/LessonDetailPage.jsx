import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LessonDetailPage() {
  const { lessonId } = useParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  
  // Mock lesson data
  const lesson = {
    1: {
      title: 'संज्ञा (Noun)',
      icon: '📝',
      difficulty: 'आसान',
      duration: 15,
      sections: [
        {
          title: 'परिचय',
          content: [
            'संज्ञा उस शब्द को कहते हैं जिससे किसी व्यक्ति, स्थान, वस्तु, भाव या प्राणी के नाम का बोध हो।',
            'उदाहरण: राम, दिल्ली, किताब, प्रेम, गाय'
          ]
        },
        {
          title: 'संज्ञा के प्रकार',
          content: [
            '1. व्यक्तिवाचक संज्ञा: किसी विशेष व्यक्ति, स्थान या वस्तु का नाम। उदाहरण: राम, दिल्ली, ताजमहल',
            '2. जातिवाचक संज्ञा: किसी जाति या वर्ग का बोध कराने वाली संज्ञा। उदाहरण: लड़का, शहर, नदी',
            '3. भाववाचक संज्ञा: किसी भाव, गुण या अवस्था का बोध कराने वाली संज्ञा। उदाहरण: सुंदरता, बचपन, क्रोध',
            '4. समूहवाचक संज्ञा: समूह का बोध कराने वाली संज्ञा। उदाहरण: सेना, टीम, परिवार',
            '5. द्रव्यवाचक संज्ञा: पदार्थ या द्रव्य का बोध कराने वाली संज्ञा। उदाहरण: सोना, दूध, पानी'
          ]
        },
        {
          title: 'उदाहरण और अभ्यास',
          content: [
            'व्यक्तिवाचक संज्ञा के उदाहरण: महात्मा गांधी, मुंबई, गंगा नदी, रामायण',
            'जातिवाचक संज्ञा के उदाहरण: आदमी, पशु, फल, फूल',
            'भाववाचक संज्ञा के उदाहरण: ईमानदारी, मित्रता, थकान, खुशी'
          ]
        }
      ]
    },
    2: {
      title: 'सर्वनाम (Pronoun)',
      icon: '👤',
      difficulty: 'आसान',
      duration: 20,
      sections: [
        {
          title: 'परिचय',
          content: [
            'संज्ञा के स्थान पर प्रयोग होने वाले शब्द को सर्वनाम कहते हैं।',
            'उदाहरण: मैं, तुम, वह, यह, कोई, कुछ'
          ]
        },
        {
          title: 'सर्वनाम के प्रकार',
          content: [
            '1. पुरुषवाचक सर्वनाम: उत्तम पुरुष (मैं, हम), मध्यम पुरुष (तू, तुम, आप), अन्य पुरुष (वह, वे)',
            '2. निश्चयवाचक सर्वनाम: यह, वह, ये, वे',
            '3. अनिश्चयवाचक सर्वनाम: कोई, कुछ',
            '4. संबंधवाचक सर्वनाम: जो, सो',
            '5. प्रश्नवाचक सर्वनाम: कौन, क्या',
            '6. निजवाचक सर्वनाम: आप, स्वयं, खुद'
          ]
        },
        {
          title: 'उदाहरण',
          content: [
            'मैं स्कूल जाता हूँ। (उत्तम पुरुष)',
            'तुम क्या कर रहे हो? (मध्यम पुरुष)',
            'वह मेरा दोस्त है। (अन्य पुरुष)',
            'कोई आ रहा है। (अनिश्चयवाचक)',
            'जो करेगा सो भरेगा। (संबंधवाचक)'
          ]
        }
      ]
    }
  };
  
  const currentLesson = lesson[lessonId] || lesson[1];
  const progress = ((completedSections.length + 1) / currentLesson.sections.length) * 100;
  
  const handleCompleteSection = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
      toast.success('अनुभाग पूर्ण!');
    }
    
    if (currentSection < currentLesson.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      toast.success('बधाई हो! पाठ पूर्ण हो गया! 🎉');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/lessons" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hindi-text">सभी पाठों पर वापस</span>
          </Link>
        </Button>
        
        {/* Lesson Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl">
                {currentLesson.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground hindi-text">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="hindi-text">{currentLesson.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {currentLesson.duration} मिनट
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground hindi-text">प्रगति</span>
              <span className="font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        {/* Lesson Content */}
        <Tabs value={currentSection.toString()} onValueChange={(v) => setCurrentSection(parseInt(v))} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            {currentLesson.sections.map((section, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className="flex items-center space-x-2 hindi-text"
              >
                {completedSections.includes(index) && (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
                <span>{section.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {currentLesson.sections.map((section, index) => (
            <TabsContent key={index} value={index.toString()}>
              <Card className="p-8 space-y-6 animate-scale-in">
                <h2 className="text-2xl font-bold text-foreground hindi-text">
                  {section.title}
                </h2>
                
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-base text-foreground leading-relaxed hindi-text">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className="hindi-text"
                  >
                    पिछला
                  </Button>
                  
                  <Button onClick={handleCompleteSection} className="hindi-text">
                    {currentSection < currentLesson.sections.length - 1 ? 'अगला' : 'पाठ पूर्ण करें'}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}