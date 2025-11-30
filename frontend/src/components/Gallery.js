import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import { format } from "date-fns";

const Gallery = ({ role }) => {
  const [images, setImages] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_data: "",
    image_name: ""
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API}/gallery/list`);
      setImages(response.data);
    } catch (error) {
      toast.error("Failed to load gallery");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image_data: reader.result.split(',')[1],
          image_name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/gallery/upload`, formData);
      toast.success("Image uploaded successfully!");
      setShowUploadDialog(false);
      setFormData({ title: "", description: "", image_data: "", image_name: "" });
      fetchImages();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await axios.delete(`${API}/gallery/${imageId}`);
      toast.success("Image deleted successfully!");
      fetchImages();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const openImage = (image) => {
    setSelectedImage(image);
    setShowImageDialog(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">School Gallery</h2>
        {(role === "teacher" || role === "principal") && (
          <Button
            onClick={() => setShowUploadDialog(true)}
            data-testid="upload-image-btn"
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card 
            key={image.id} 
            data-testid={`gallery-image-${image.id}`} 
            className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div 
              className="relative aspect-video bg-gray-100"
              onClick={() => openImage(image)}
            >
              <img 
                src={`data:image/jpeg;base64,${image.image_data}`} 
                alt={image.title}
                className="w-full h-full object-cover"
              />
              {(role === "teacher" || role === "principal") && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image.id);
                  }}
                  data-testid={`delete-image-${image.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{image.title}</CardTitle>
              <CardDescription>
                {image.description && <p className="mb-1">{image.description}</p>}
                <p className="text-xs">Uploaded by {image.uploaded_by_name} • {format(new Date(image.uploaded_at), 'PP')}</p>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}

        {images.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No images in gallery yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl" data-testid="upload-image-dialog">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>Add photos to the school gallery</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-title">Title</Label>
              <Input
                id="image-title"
                data-testid="image-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-description">Description</Label>
              <Textarea
                id="image-description"
                data-testid="image-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-file">Upload Image</Label>
              <Input
                id="image-file"
                data-testid="image-file"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {formData.image_name && (
                <p className="text-sm text-green-600">✓ {formData.image_name}</p>
              )}
            </div>

            <Button type="submit" data-testid="submit-image-btn" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
              Upload Image
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image View Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedImage.title}</DialogTitle>
                <DialogDescription>
                  {selectedImage.description}
                </DialogDescription>
              </DialogHeader>
              <div className="relative">
                <img 
                  src={`data:image/jpeg;base64,${selectedImage.image_data}`} 
                  alt={selectedImage.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="text-sm text-gray-600">
                Uploaded by {selectedImage.uploaded_by_name} on {format(new Date(selectedImage.uploaded_at), 'PPP')}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
