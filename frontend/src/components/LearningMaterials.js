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
import { Plus, Trash2, FileText, Video, Link as LinkIcon, Smartphone, File } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";

const LearningMaterials = ({ role }) => {
  const [materials, setMaterials] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    material_type: "document",
    class_section: "",
    url: "",
    file_data: "",
    file_name: ""
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API}/materials/list`);
      setMaterials(response.data);
    } catch (error) {
      toast.error("Failed to load materials");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
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
      await axios.post(`${API}/materials/create`, formData);
      toast.success("Material uploaded successfully!");
      setShowUploadDialog(false);
      setFormData({
        title: "",
        description: "",
        material_type: "document",
        class_section: "",
        url: "",
        file_data: "",
        file_name: ""
      });
      fetchMaterials();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    
    try {
      await axios.delete(`${API}/materials/${materialId}`);
      toast.success("Material deleted successfully!");
      fetchMaterials();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "video": return <Video className="w-5 h-5" />;
      case "link": return <LinkIcon className="w-5 h-5" />;
      case "app": return <Smartphone className="w-5 h-5" />;
      case "document": return <FileText className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "video": return "bg-red-500";
      case "link": return "bg-blue-500";
      case "app": return "bg-green-500";
      case "document": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const openMaterial = (material) => {
    if (material.url) {
      window.open(material.url, '_blank');
    } else if (material.file_data) {
      // Create a download link for the file
      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${material.file_data}`;
      link.download = material.file_name || 'download';
      link.click();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Learning Materials</h2>
        {role === "teacher" && (
          <Button
            onClick={() => setShowUploadDialog(true)}
            data-testid="upload-material-btn"
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Material
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material.id} data-testid={`material-${material.id}`} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className={`${getTypeColor(material.material_type)} p-3 rounded-lg text-white`}>
                    {getIcon(material.material_type)}
                  </div>
                  <div className="flex-1">
                    <CardTitle>{material.title}</CardTitle>
                    <CardDescription className="mt-2">{material.description}</CardDescription>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline">Class {material.class_section}</Badge>
                      <Badge className={getTypeColor(material.material_type)}>
                        {material.material_type.charAt(0).toUpperCase() + material.material_type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openMaterial(material)}
                    data-testid={`open-material-${material.id}`}
                  >
                    {material.url ? "Open Link" : "Download"}
                  </Button>
                  {role === "teacher" && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(material.id)}
                      data-testid={`delete-material-${material.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {materials.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No learning materials uploaded yet
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl" data-testid="upload-material-dialog">
          <DialogHeader>
            <DialogTitle>Upload Learning Material</DialogTitle>
            <DialogDescription>Share resources with your students</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material-title">Title</Label>
              <Input
                id="material-title"
                data-testid="material-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material-description">Description</Label>
              <Textarea
                id="material-description"
                data-testid="material-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material-type">Material Type</Label>
                <Select
                  value={formData.material_type}
                  onValueChange={(value) => setFormData({ ...formData, material_type: value })}
                >
                  <SelectTrigger id="material-type" data-testid="material-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="material-class">Class/Section</Label>
                <Input
                  id="material-class"
                  data-testid="material-class-section"
                  placeholder="e.g., 10th A"
                  value={formData.class_section}
                  onChange={(e) => setFormData({ ...formData, class_section: e.target.value })}
                  required
                />
              </div>
            </div>

            {(formData.material_type === "video" || formData.material_type === "link" || formData.material_type === "app") ? (
              <div className="space-y-2">
                <Label htmlFor="material-url">URL</Label>
                <Input
                  id="material-url"
                  data-testid="material-url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="material-file">Upload File</Label>
                <Input
                  id="material-file"
                  data-testid="material-file"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
                {formData.file_name && (
                  <p className="text-sm text-gray-600">Selected: {formData.file_name}</p>
                )}
              </div>
            )}

            <Button type="submit" data-testid="submit-material-btn" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
              Upload Material
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningMaterials;
