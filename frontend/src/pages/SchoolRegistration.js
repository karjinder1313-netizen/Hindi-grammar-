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
    udise_code: "",
    principal_name: "",
    principal_email: "",
    principal_phone: "",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${API}/school/register`, formData);
      toast.success("School registered successfully!");
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
            <CardTitle className="text-2xl">School Information</CardTitle>
            <CardDescription>Please provide your school details and UDISE code</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="school-name" className="text-base font-medium">
                    School Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="school-name"
                    data-testid="school-name"
                    placeholder="Enter your school name"
                    value={formData.school_name}
                    onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="udise-code" className="text-base font-medium">
                    UDISE Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="udise-code"
                    data-testid="udise-code"
                    placeholder="11-digit UDISE code"
                    value={formData.udise_code}
                    onChange={(e) => setFormData({ ...formData, udise_code: e.target.value })}
                    required
                    maxLength={11}
                    pattern="[0-9]{11}"
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500">Enter 11-digit UDISE code from UDISE portal</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principal-name" className="text-base font-medium">
                    Principal Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="principal-name"
                    data-testid="principal-name"
                    placeholder="Principal's full name"
                    value={formData.principal_name}
                    onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principal-email" className="text-base font-medium">
                    Principal Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="principal-email"
                    data-testid="principal-email"
                    type="email"
                    placeholder="principal@school.com"
                    value={formData.principal_email}
                    onChange={(e) => setFormData({ ...formData, principal_email: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principal-phone" className="text-base font-medium">
                    Principal Phone
                  </Label>
                  <Input
                    id="principal-phone"
                    data-testid="principal-phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.principal_phone}
                    onChange={(e) => setFormData({ ...formData, principal_phone: e.target.value })}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-base font-medium">
                    School Address
                  </Label>
                  <Textarea
                    id="address"
                    data-testid="school-address"
                    placeholder="Enter complete school address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">What is UDISE Code?</p>
                    <p>UDISE (Unified District Information System for Education) is a unique 11-digit code assigned to every school in India. You can find it on your school's official documents or UDISE+ portal.</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                data-testid="register-school-btn" 
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                Register School
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Already registered? The system will redirect you to login automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
