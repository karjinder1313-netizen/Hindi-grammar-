import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Eye, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const QuizList = ({ role }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [showTakeDialog, setShowTakeDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ submission_id: "", feedback: "" });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${API}/quiz/list`);
      setQuizzes(response.data);
    } catch (error) {
      toast.error("Failed to load quizzes");
    }
  };

  const fetchSubmissions = async (quizId) => {
    try {
      const response = await axios.get(`${API}/quiz/${quizId}/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      toast.error("Failed to load submissions");
    }
  };

  const handleViewSubmissions = async (quiz) => {
    setSelectedQuiz(quiz);
    await fetchSubmissions(quiz.id);
    setShowViewDialog(true);
  };

  const handleTakeQuiz = async (quiz) => {
    try {
      const response = await axios.get(`${API}/quiz/${quiz.id}`);
      setSelectedQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(""));
      setShowTakeDialog(true);
    } catch (error) {
      toast.error("Failed to load quiz");
    }
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        quiz_id: selectedQuiz.id,
        answers: answers.map((answer, index) => ({
          question_index: index,
          answer: answer
        }))
      };
      const response = await axios.post(`${API}/quiz/submit`, payload);
      setQuizResult(response.data);
      setShowTakeDialog(false);
      setShowResultDialog(true);
      fetchQuizzes();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to submit quiz");
    }
  };

  const handleAddFeedback = async (e, submissionId) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API}/quiz/submission/${submissionId}/feedback?feedback=${feedbackData.feedback}`
      );
      toast.success("Feedback added successfully!");
      await fetchSubmissions(selectedQuiz.id);
      setFeedbackData({ submission_id: "", feedback: "" });
    } catch (error) {
      toast.error("Failed to add feedback");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quizzes & Tests</h2>
        {role === "teacher" && (
          <Button onClick={() => navigate("/teacher/quiz/create")} data-testid="create-quiz-nav-btn">
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} data-testid={`quiz-${quiz.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription className="mt-2">{quiz.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">Class {quiz.class_section}</Badge>
                  <Badge>{quiz.total_points} points</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {quiz.questions?.length || 0} questions
                  {quiz.due_date && (
                    <span className="ml-4">Due: {format(new Date(quiz.due_date), 'PPp')}</span>
                  )}
                </div>
                {role === "teacher" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleViewSubmissions(quiz)}
                    data-testid={`view-quiz-submissions-${quiz.id}`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Submissions
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleTakeQuiz(quiz)}
                    data-testid={`take-quiz-${quiz.id}`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {quizzes.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No quizzes available yet
            </CardContent>
          </Card>
        )}
      </div>

      {/* Take Quiz Dialog */}
      <Dialog open={showTakeDialog} onOpenChange={setShowTakeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="take-quiz-dialog">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.title}</DialogTitle>
            <DialogDescription>{selectedQuiz?.description}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitQuiz} className="space-y-6">
            {selectedQuiz?.questions.map((q, index) => (
              <Card key={index} data-testid={`quiz-question-${index}`}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Question {index + 1} ({q.points} {q.points === 1 ? 'point' : 'points'})
                  </CardTitle>
                  <CardDescription>{q.question}</CardDescription>
                </CardHeader>
                <CardContent>
                  {q.type === "mcq" && q.options ? (
                    <RadioGroup
                      value={answers[index]}
                      onValueChange={(value) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = value;
                        setAnswers(newAnswers);
                      }}
                    >
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option}
                            id={`q${index}-o${oIndex}`}
                            data-testid={`quiz-q${index}-option-${oIndex}`}
                          />
                          <Label htmlFor={`q${index}-o${oIndex}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Input
                      data-testid={`quiz-q${index}-answer`}
                      placeholder="Enter your answer"
                      value={answers[index]}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      required
                    />
                  )}
                </CardContent>
              </Card>
            ))}
            <Button type="submit" data-testid="submit-quiz-btn" className="w-full">
              Submit Quiz
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quiz Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent data-testid="quiz-result-dialog">
          <DialogHeader>
            <DialogTitle>Quiz Submitted!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {quizResult?.score} / {quizResult?.total_points}
            </div>
            <p className="text-gray-600">Your score</p>
          </div>
          <Button onClick={() => setShowResultDialog(false)} data-testid="close-result-btn" className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* View Submissions Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="view-quiz-submissions-dialog">
          <DialogHeader>
            <DialogTitle>Submissions for {selectedQuiz?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {submissions.map((sub) => (
              <Card key={sub.id} data-testid={`quiz-submission-${sub.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{sub.student_name}</CardTitle>
                      <CardDescription>
                        Submitted: {format(new Date(sub.submitted_at), 'PPp')}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-600">
                      {sub.score} / {sub.total_points} points
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sub.teacher_feedback && (
                    <div>
                      <Label>Teacher Feedback:</Label>
                      <p className="text-sm mt-1">{sub.teacher_feedback}</p>
                    </div>
                  )}
                  {!sub.teacher_feedback && (
                    <form onSubmit={(e) => handleAddFeedback(e, sub.id)} className="space-y-3 border-t pt-4">
                      <div className="space-y-2">
                        <Label>Add Feedback (Optional)</Label>
                        <Textarea
                          data-testid={`quiz-feedback-input-${sub.id}`}
                          placeholder="Additional comments or feedback"
                          value={feedbackData.submission_id === sub.id ? feedbackData.feedback : ""}
                          onChange={(e) => setFeedbackData({ submission_id: sub.id, feedback: e.target.value })}
                          rows={3}
                          required
                        />
                      </div>
                      <Button type="submit" data-testid={`quiz-feedback-submit-${sub.id}`} size="sm">
                        Add Feedback
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

export default QuizList;
