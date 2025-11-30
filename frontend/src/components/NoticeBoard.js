import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Bell, AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import { format } from "date-fns";

const NoticeBoard = ({ role }) => {
  const [notices, setNotices] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    expires_at: ""
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${API}/notices/list`);
      setNotices(response.data);
    } catch (error) {
      toast.error("Failed to load notices");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
      };
      await axios.post(`${API}/notices/create`, payload);
      toast.success("Notice posted successfully!");
      setShowCreateDialog(false);
      setFormData({ title: "", content: "", priority: "medium", expires_at: "" });
      fetchNotices();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    
    try {
      await axios.delete(`${API}/notices/${noticeId}`);
      toast.success("Notice deleted successfully!");
      fetchNotices();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-blue-500";
      case "low": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === "urgent" || priority === "high") {
      return <AlertCircle className="w-4 h-4" />;
    }
    return <Bell className="w-4 h-4" />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notice Board</h2>
        {(role === "teacher" || role === "principal") && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            data-testid="create-notice-btn"
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Notice
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {notices.map((notice) => (
          <Card key={notice.id} data-testid={`notice-${notice.id}`} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${getPriorityColor(notice.priority)} p-2 rounded-lg text-white`}>
                      {getPriorityIcon(notice.priority)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{notice.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Posted by {notice.created_by_name} • {format(new Date(notice.created_at), 'PPp')}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(notice.priority)}>
                    {notice.priority.toUpperCase()}
                  </Badge>
                  {(role === "teacher" || role === "principal") && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(notice.id)}
                      data-testid={`delete-notice-${notice.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
              {notice.expires_at && (
                <p className="text-sm text-gray-500 mt-4">
                  Expires: {format(new Date(notice.expires_at), 'PPP')}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {notices.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No notices posted yet
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Notice Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl" data-testid="create-notice-dialog">
          <DialogHeader>
            <DialogTitle>Post New Notice</DialogTitle>
            <DialogDescription>Share important information with everyone</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notice-title">Title</Label>
              <Input
                id="notice-title"
                data-testid="notice-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice-content">Content</Label>
              <Textarea
                id="notice-content"
                data-testid="notice-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notice-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="notice-priority" data-testid="notice-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires-at">Expires On (Optional)</Label>
                <Input
                  id="expires-at"
                  data-testid="notice-expires"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" data-testid="submit-notice-btn" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              Post Notice
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticeBoard;
