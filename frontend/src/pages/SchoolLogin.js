import { useState } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { School, Lock } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";

const SchoolLogin = ({ onSchoolVerified }) => {
  const [formData, setFormData] = useState({
    school_name: "",
    udise_code: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Trim whitespace from inputs
      const trimmedName = formData.school_name.trim();
      const trimmedUdise = formData.udise_code.trim();
      
      await axios.post(`${API}/school/verify-login?school_name=${encodeURIComponent(trimmedName)}&udise_code=${trimmedUdise}`);
      toast.success("School verified! Please login with your credentials.");
      onSchoolVerified(trimmedName);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
              <School className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            School Login
          </h1>
          <p className="text-gray-700 text-lg font-medium">Verify your school to access the portal</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              School Verification
            </CardTitle>
            <CardDescription>Enter your school details to continue</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="school-name" className="text-base font-medium">
                  School Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="school-name"
                  data-testid="school-login-name"
                  placeholder="Enter your school name"
                  value={formData.school_name}
                  onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                  required
                  className="h-11"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="udise-code" className="text-base font-medium">
                  UDISE Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="udise-code"
                  data-testid="school-login-udise"
                  placeholder="Enter 11-digit UDISE code"
                  value={formData.udise_code}
                  onChange={(e) => setFormData({ ...formData, udise_code: e.target.value })}
                  required
                  maxLength={11}
                  pattern="[0-9]{11}"
                  className="h-11 font-mono"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Secure Access:</strong> Both school name and UDISE code are required to verify your school's identity before login.
                </p>
              </div>

              <Button 
                type="submit" 
                data-testid="verify-school-btn" 
                disabled={loading}
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                {loading ? "Verifying..." : "Verify School"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>This security measure ensures only authorized school users can access the portal.</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin;
