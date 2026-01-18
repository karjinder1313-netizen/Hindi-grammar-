import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginData, setLoginData] = useState({
    mobile: '',
    password: ''
  });

  // Register State
  const [registerData, setRegisterData] = useState({
    name: '',
    mobile: '',
    school: '',
    class_name: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(loginData.mobile, loginData.password);
    
    if (result.success) {
      toast.success('लॉगिन सफल!');
      navigate('/');
    } else {
      toast.error(result.error || 'लॉगिन विफल रहा');
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('पासवर्ड मेल नहीं खा रहे हैं');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      return;
    }

    setLoading(true);

    const result = await register({
      name: registerData.name,
      mobile: registerData.mobile,
      school: registerData.school,
      class_name: registerData.class_name,
      password: registerData.password
    });
    
    if (result.success) {
      toast.success('पंजीकरण सफल!');
      navigate('/');
    } else {
      toast.error(result.error || 'पंजीकरण विफल रहा');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground hindi-text">
            हिंदी व्याकरण में आपका स्वागत है
          </h1>
          <p className="text-sm text-muted-foreground hindi-text">
            अपनी हिंदी व्याकरण यात्रा शुरू करें
          </p>
        </div>

        {/* Auth Tabs */}
        <Card className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="hindi-text">
                <LogIn className="h-4 w-4 mr-2" />
                लॉगिन
              </TabsTrigger>
              <TabsTrigger value="register" className="hindi-text">
                <UserPlus className="h-4 w-4 mr-2" />
                पंजीकरण
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-mobile" className="hindi-text">मोबाइल नंबर</Label>
                  <Input
                    id="login-mobile"
                    type="tel"
                    placeholder="10 अंकों का मोबाइल नंबर"
                    value={loginData.mobile}
                    onChange={(e) => setLoginData({ ...loginData, mobile: e.target.value })}
                    required
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="hindi-text">पासवर्ड</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="पासवर्ड दर्ज करें"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full hindi-text" disabled={loading}>
                  {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="hindi-text">नाम</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="अपना पूरा नाम दर्ज करें"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-mobile" className="hindi-text">मोबाइल नंबर</Label>
                  <Input
                    id="register-mobile"
                    type="tel"
                    placeholder="10 अंकों का मोबाइल नंबर"
                    value={registerData.mobile}
                    onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                    required
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                  />
                  <p className="text-xs text-muted-foreground hindi-text">
                    6-9 से शुरू होने वाला 10 अंकों का नंबर
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-school" className="hindi-text">स्कूल का नाम</Label>
                  <Input
                    id="register-school"
                    type="text"
                    placeholder="अपने स्कूल का नाम दर्ज करें"
                    value={registerData.school}
                    onChange={(e) => setRegisterData({ ...registerData, school: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-class" className="hindi-text">कक्षा</Label>
                  <Input
                    id="register-class"
                    type="text"
                    placeholder="उदाहरण: कक्षा 8"
                    value={registerData.class_name}
                    onChange={(e) => setRegisterData({ ...registerData, class_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="hindi-text">पासवर्ड</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="कम से कम 6 अक्षर"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="hindi-text">पासवर्ड पुष्टि करें</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="पासवर्ड फिर से दर्ज करें"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full hindi-text" disabled={loading}>
                  {loading ? 'पंजीकरण हो रहा है...' : 'पंजीकरण करें'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
          <p className="text-sm text-center text-foreground hindi-text">
            लॉगिन करके आप अपनी प्रगति को सहेज सकते हैं और सभी सुविधाओं का उपयोग कर सकते हैं
          </p>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
