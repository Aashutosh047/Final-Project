import { useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadedImage, imageLabels } from "@/types/assessment";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadFormProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

const labelOptions: Array<UploadedImage["label"]> = [
  "front_hairline",
  "crown_top",
  "side_view",
  "scalp_closeup",
];

export function ImageUploadForm({ images, onChange }: ImageUploadFormProps) {
  const { toast } = useToast();

  const handleFileSelect = useCallback(
    (label: UploadedImage["label"], event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      const newImage: UploadedImage = {
        id: `${label}-${Date.now()}`,
        file,
        preview,
        label,
      };

      // Replace existing image with same label or add new
      const updatedImages = images.filter((img) => img.label !== label);
      onChange([...updatedImages, newImage]);
    },
    [images, onChange, toast]
  );

  const removeImage = useCallback(
    (label: UploadedImage["label"]) => {
      const imageToRemove = images.find((img) => img.label === label);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      onChange(images.filter((img) => img.label !== label));
    },
    [images, onChange]
  );

  const getImageByLabel = (label: UploadedImage["label"]) => {
    return images.find((img) => img.label === label);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Upload Images</h3>
        <p className="text-muted-foreground">
          Upload photos of your hair and scalp for visual assessment
        </p>
      </div>

      <div className="bg-secondary/30 rounded-xl p-4 mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>Tips for best results:</strong> Take photos in good lighting, ensure the area is 
          clearly visible, and keep images in focus. At least one image is recommended.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {labelOptions.map((label) => {
          const existingImage = getImageByLabel(label);
          return (
            <div key={label} className="space-y-2">
              <Label className="text-sm font-medium">{imageLabels[label]}</Label>
              <div
                className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                  existingImage
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                {existingImage ? (
                  <div className="relative aspect-video">
                    <img
                      src={existingImage.preview}
                      alt={imageLabels[label]}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-8 h-8"
                      onClick={() => removeImage(label)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(label, e)}
                    />
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium">Click to upload</span>
                      <span className="text-xs">JPG, PNG up to 10MB</span>
                    </div>
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {images.length} of 4 images uploaded
      </div>
    </motion.div>
  );
}
