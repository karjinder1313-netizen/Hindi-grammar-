import { useState } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { School, CheckCircle } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";

const SchoolRegistration = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    school_name: "",
    udise_code: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${API}/school/register`, formData);
      toast.success("School registered successfully! You can now login.");
      onRegistrationComplete();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
              <School className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            School Registration Portal
          </h1>
          <p className="text-gray-700 text-lg font-medium">Register your school to get started</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription>This is a one-time setup. Enter your school name to get started.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="school-name" className="text-lg font-medium">
                  School Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="school-name"
                  data-testid="school-name"
                  placeholder="Enter your school name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                  className="h-14 text-lg"
                  autoFocus
                />
                <p className="text-sm text-gray-500">
                  Example: Government Senior Secondary School, ABC Public School, etc.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">One-time Setup</p>
                    <p>You only need to register your school once. After registration, teachers, students, and the principal can create their accounts and login.</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                data-testid="register-school-btn" 
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                Register & Continue
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600 bg-white/50 rounded-lg p-4 max-w-md mx-auto">
          <p className="font-medium mb-2">After Registration:</p>
          <p>• Teachers can create accounts and manage classes</p>
          <p>• Students can join and access their assignments</p>
          <p>• Principal gets full oversight of school activities</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
