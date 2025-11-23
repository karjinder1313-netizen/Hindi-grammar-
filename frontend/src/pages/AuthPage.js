import { useState } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

const AuthPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [schoolName, setSchoolName] = useState("Student Portal");
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "student",
    class_section: ""
  });

  useEffect(() => {
    fetchSchoolName();
  }, []);

  const fetchSchoolName = async () => {
    try {
      const response = await axios.get(`${API}/settings/school`);
      setSchoolName(response.data.school_name);
    } catch (error) {
      console.error("Failed to load school name");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: formData.email }
        : formData;

      const response = await axios.post(`${API}${endpoint}`, payload);
      
      localStorage.setItem("token", response.data.access_token);
      setUser(response.data.user);
      toast.success(isLogin ? "Login successful!" : "Registration successful!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Portal</h1>
          <p className="text-gray-600">Class Management System</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">Sign in or create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" onValueChange={(v) => setIsLogin(v === "login")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
                <TabsTrigger value="register" data-testid="register-tab">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      data-testid="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500">No password required - just enter your registered email</p>
                  </div>
                  <Button type="submit" data-testid="login-submit-btn" className="w-full bg-blue-600 hover:bg-blue-700">
                    Login
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      data-testid="register-name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      data-testid="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500">Use this email to login later (no password needed)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger id="register-role" data-testid="register-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student" data-testid="role-student">Student</SelectItem>
                        <SelectItem value="teacher" data-testid="role-teacher">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.role === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="register-class">Class/Section</Label>
                      <Input
                        id="register-class"
                        data-testid="register-class-section"
                        type="text"
                        placeholder="e.g., 10th A, 12th B"
                        value={formData.class_section}
                        onChange={(e) => setFormData({ ...formData, class_section: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" data-testid="register-submit-btn" className="w-full bg-blue-600 hover:bg-blue-700">
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
