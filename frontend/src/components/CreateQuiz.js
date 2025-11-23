import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    class_section: "",
    due_date: ""
  });
  const [questions, setQuestions] = useState([{
    question: "",
    type: "mcq",
    options: ["", "", "", ""],
    correct_answer: "",
    points: 1
  }]);

  const addQuestion = () => {
    setQuestions([...questions, {
      question: "",
      type: "mcq",
      options: ["", "", "", ""],
      correct_answer: "",
      points: 1
    }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const totalPoints = questions.reduce((sum, q) => sum + parseInt(q.points), 0);
      
      const payload = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        questions: questions.map(q => ({
          ...q,
          options: q.type === "mcq" ? q.options : null,
          points: parseInt(q.points)
        })),
        total_points: totalPoints
      };
      
      await axios.post(`${API}/quiz/create`, payload);
      toast.success("Quiz created successfully!");
      navigate("/teacher/quiz");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate("/teacher/quiz")}
        className="mb-4"
        data-testid="back-btn"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                data-testid="quiz-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                data-testid="quiz-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_section">Class/Section</Label>
              <Input
                id="class_section"
                data-testid="quiz-class-section"
                placeholder="e.g., 10th A, 12th B"
                value={formData.class_section}
                onChange={(e) => setFormData({ ...formData, class_section: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date (Optional)</Label>
              <Input
                id="due_date"
                data-testid="quiz-due-date"
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Questions</h3>
                <Button type="button" onClick={addQuestion} data-testid="add-question-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {questions.map((q, qIndex) => (
                <Card key={qIndex} className="mb-4">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Question {qIndex + 1}</h4>
                      {questions.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                          data-testid={`remove-question-${qIndex}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Question Text</Label>
                      <Input
                        data-testid={`question-text-${qIndex}`}
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={q.type}
                          onValueChange={(value) => updateQuestion(qIndex, 'type', value)}
                        >
                          <SelectTrigger data-testid={`question-type-${qIndex}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                            <SelectItem value="true_false">True/False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          data-testid={`question-points-${qIndex}`}
                          value={q.points}
                          onChange={(e) => updateQuestion(qIndex, 'points', e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    {q.type === "mcq" && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {q.options.map((opt, oIndex) => (
                          <Input
                            key={oIndex}
                            data-testid={`question-${qIndex}-option-${oIndex}`}
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            required
                          />
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Input
                        data-testid={`question-${qIndex}-correct-answer`}
                        placeholder={q.type === "true_false" ? "true or false" : "Enter correct answer"}
                        value={q.correct_answer}
                        onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button type="submit" data-testid="create-quiz-btn" className="w-full">
              Create Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuiz;
