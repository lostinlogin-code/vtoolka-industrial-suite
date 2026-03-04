import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = "products";

export default function ImageUploader({ images, onChange, maxFiles = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`${file.name}: только JPG, PNG, WebP`);
      return null;
    }
    if (file.size > MAX_SIZE) {
      toast.error(`${file.name}: максимум 5MB`);
      return null;
    }

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      toast.error(`Ошибка загрузки ${file.name}`);
      return null;
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = maxFiles - images.length;
    if (remaining <= 0) {
      toast.error(`Максимум ${maxFiles} изображений`);
      return;
    }
    const batch = fileArray.slice(0, remaining);
    setUploading(true);
    setProgress(0);

    const uploaded: string[] = [];
    for (let i = 0; i < batch.length; i++) {
      const url = await uploadFile(batch[i]);
      if (url) uploaded.push(url);
      setProgress(Math.round(((i + 1) / batch.length) * 100));
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
      toast.success(`Загружено ${uploaded.length} файл(ов)`);
    }
    setUploading(false);
    setProgress(0);
  }, [images, maxFiles, onChange]);

  const removeImage = async (url: string) => {
    // Extract path from URL
    const parts = url.split(`/storage/v1/object/public/${BUCKET}/`);
    if (parts[1]) {
      await supabase.storage.from(BUCKET).remove([parts[1]]);
    }
    onChange(images.filter((i) => i !== url));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragOver ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
            <div className="w-full max-w-[200px] bg-secondary rounded-full h-2">
              <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Paperclip className="w-5 h-5" />
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              Нажмите или перетащите изображения
            </p>
            <p className="text-xs text-muted-foreground/70">
              JPG, PNG, WebP · до 5MB · макс. {maxFiles} фото
            </p>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
