import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Eye, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getErrorMessage } from "@/utils/errorHandler";

const HomeworkList = ({ role }) => {
  const navigate = useNavigate();
  const [homeworks, setHomeworks] = useState([]);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [submitData, setSubmitData] = useState({ 
    submission_text: "", 
    file_data: "", 
    file_name: "",
    photo_data: "",
    photo_name: ""
  });
  const [gradeData, setGradeData] = useState({ submission_id: "", grade: "", feedback: "" });

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      const response = await axios.get(`${API}/homework/list`);
      setHomeworks(response.data);
    } catch (error) {
      toast.error("Failed to load homework");
    }
  };

  const fetchSubmissions = async (homeworkId) => {
    try {
      const response = await axios.get(`${API}/homework/${homeworkId}/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      toast.error("Failed to load submissions");
    }
  };

  const handleViewSubmissions = async (homework) => {
    setSelectedHomework(homework);
    await fetchSubmissions(homework.id);
    setShowViewDialog(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubmitData({
          ...submitData,
          file_data: reader.result.split(',')[1],
          file_name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        homework_id: selectedHomework.id,
        ...submitData
      };
      await axios.post(`${API}/homework/submit`, payload);
      toast.success("Homework submitted successfully!");
      setShowSubmitDialog(false);
      fetchHomeworks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API}/homework/submission/${gradeData.submission_id}/grade?grade=${gradeData.grade}&feedback=${gradeData.feedback}`
      );
      toast.success("Homework graded successfully!");
      await fetchSubmissions(selectedHomework.id);
      setGradeData({ submission_id: "", grade: "", feedback: "" });
    } catch (error) {
      toast.error("Failed to grade homework");
    }
  };

  const isDueSoon = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = due - now;
    return diff > 0 && diff < 24 * 60 * 60 * 1000; // Less than 24 hours
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Homework Assignments</h2>
        {role === "teacher" && (
          <Button onClick={() => navigate("/teacher/homework/create")} data-testid="create-homework-nav-btn">
            <Plus className="w-4 h-4 mr-2" />
            Create Homework
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {homeworks.map((homework) => (
          <Card key={homework.id} data-testid={`homework-${homework.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{homework.title}</CardTitle>
                  <CardDescription className="mt-2">{homework.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">Class {homework.class_section}</Badge>
                  {isOverdue(homework.due_date) && <Badge variant="destructive">Overdue</Badge>}
                  {isDueSoon(homework.due_date) && !isOverdue(homework.due_date) && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Due Soon</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {format(new Date(homework.due_date), 'PPp')}</span>
                  </div>
                </div>
                {role === "teacher" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleViewSubmissions(homework)}
                    data-testid={`view-submissions-${homework.id}`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Submissions
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedHomework(homework);
                      setShowSubmitDialog(true);
                    }}
                    data-testid={`submit-homework-${homework.id}`}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {homeworks.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No homework assignments yet
            </CardContent>
          </Card>
        )}
      </div>

      {/* Submit Dialog for Students */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent data-testid="submit-homework-dialog">
          <DialogHeader>
            <DialogTitle>Submit Homework</DialogTitle>
            <DialogDescription>{selectedHomework?.title}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Text Submission (Optional)</Label>
              <Textarea
                data-testid="submission-text"
                value={submitData.submission_text}
                onChange={(e) => setSubmitData({ ...submitData, submission_text: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Upload File (Optional)</Label>
              <Input
                type="file"
                data-testid="submission-file"
                onChange={handleFileChange}
              />
              {submitData.file_name && (
                <p className="text-sm text-gray-600">Selected: {submitData.file_name}</p>
              )}
            </div>
            <Button type="submit" data-testid="submit-homework-confirm" className="w-full">
              Submit Homework
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Submissions Dialog for Teachers */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="view-submissions-dialog">
          <DialogHeader>
            <DialogTitle>Submissions for {selectedHomework?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {submissions.map((sub) => (
              <Card key={sub.id} data-testid={`submission-${sub.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{sub.student_name}</CardTitle>
                      <CardDescription>
                        Submitted: {format(new Date(sub.submitted_at), 'PPp')}
                        {sub.is_late && <Badge variant="destructive" className="ml-2">Late</Badge>}
                      </CardDescription>
                    </div>
                    {sub.grade && <Badge className="bg-green-600">{sub.grade}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sub.submission_text && (
                    <div>
                      <Label>Text Submission:</Label>
                      <p className="text-sm mt-1">{sub.submission_text}</p>
                    </div>
                  )}
                  {sub.file_name && (
                    <div>
                      <Label>Attached File:</Label>
                      <p className="text-sm mt-1">{sub.file_name}</p>
                    </div>
                  )}
                  {sub.feedback && (
                    <div>
                      <Label>Feedback:</Label>
                      <p className="text-sm mt-1">{sub.feedback}</p>
                    </div>
                  )}
                  {!sub.grade && (
                    <form onSubmit={handleGrade} className="space-y-3 border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Grade</Label>
                          <Input
                            data-testid={`grade-input-${sub.id}`}
                            placeholder="A, B, C, etc."
                            value={gradeData.submission_id === sub.id ? gradeData.grade : ""}
                            onChange={(e) => setGradeData({ ...gradeData, submission_id: sub.id, grade: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Feedback</Label>
                          <Input
                            data-testid={`feedback-input-${sub.id}`}
                            placeholder="Comments"
                            value={gradeData.submission_id === sub.id ? gradeData.feedback : ""}
                            onChange={(e) => setGradeData({ ...gradeData, submission_id: sub.id, feedback: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" data-testid={`grade-submit-${sub.id}`} size="sm">
                        Submit Grade
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            ))}
            {submissions.length === 0 && (
              <p className="text-center text-gray-500 py-4">No submissions yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeworkList;
