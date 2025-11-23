import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";

const CreateHomework = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    class_section: "",
    assignment_type: "class",
    assigned_to: [],
    due_date: ""
  });
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/homework/students`);
      setStudents(response.data);
    } catch (error) {
      toast.error("Failed to load students");
    }
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        assigned_to: formData.assignment_type === "class" ? [] : selectedStudents,
        class_section: formData.assignment_type === "class" ? formData.class_section : null,
        due_date: new Date(formData.due_date).toISOString(),
        attachments: []
      };
      
      await axios.post(`${API}/homework/create`, payload);
      toast.success("Homework created successfully!");
      navigate("/teacher/homework");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate("/teacher/homework")}
        className="mb-4"
        data-testid="back-btn"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Homework</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                data-testid="homework-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                data-testid="homework-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_section">Class/Section</Label>
              <Input
                id="class_section"
                data-testid="homework-class-section"
                placeholder="e.g., 10th A, 12th B"
                value={formData.class_section}
                onChange={(e) => setFormData({ ...formData, class_section: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                data-testid="homework-due-date"
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
            </div>

            <Button type="submit" data-testid="create-homework-btn" className="w-full">
              Create Homework
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateHomework;
