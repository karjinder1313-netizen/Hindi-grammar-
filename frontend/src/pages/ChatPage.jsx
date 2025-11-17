import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'नमस्ते! मैं हिंदी व्याकरण सहायक हूँ। आप मुझसे संज्ञा, सर्वनाम, क्रिया, विशेषण, कारक, समास, संधि आदि सभी विषयों पर प्रश्न पूछ सकते हैं। मैं आपकी सहायता के लिए यहाँ हूँ!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Send to backend
      const response = await axios.post(`${API}/chat`, {
        message: userMessage,
        conversation_history: messages.filter(msg => msg.role !== 'system')
      });

      if (response.data.success) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: response.data.response 
        }]);
      } else {
        throw new Error(response.data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('प्रश्न भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'क्षमा करें, मुझे आपके प्रश्न का उत्तर देने में समस्या हो रही है। कृपया पुनः प्रयास करें।' 
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exampleQuestions = [
    'संज्ञा क्या है?',
    'कारक के कितने भेद होते हैं?',
    'समास की परिभाषा बताइए',
    'भूतकाल के कितने प्रकार हैं?'
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground hindi-text">
                AI व्याकरण सहायक
              </h1>
              <p className="text-sm text-muted-foreground hindi-text">
                सभी व्याकरण विषयों पर प्रश्न पूछें
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <Card className="flex-grow flex flex-col p-0 overflow-hidden mb-4">
          <ScrollArea className="flex-grow p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold hindi-text">AI सहायक</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap hindi-text">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-muted rounded-2xl px-4 py-3 flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground hindi-text">
                      उत्तर तैयार कर रहा हूँ...
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-background">
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2 hindi-text">
                  उदाहरण प्रश्न:
                </p>
                <div className="flex flex-wrap gap-2">
                  {exampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(question)}
                      className="text-xs hindi-text"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="अपना प्रश्न यहाँ लिखें..."
                className="flex-grow hindi-text"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="hindi-text"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    भेजें
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-accent-light border-accent/20">
          <p className="text-sm text-foreground hindi-text">
            <strong>सुझाव:</strong> आप संज्ञा, सर्वनाम, क्रिया, विशेषण, क्रिया विशेषण, वचन, लिंग, कारक, काल, समास, संधि और विलोम शब्द पर प्रश्न पूछ सकते हैं।
          </p>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
