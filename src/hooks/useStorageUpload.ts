import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

interface UseStorageUploadReturn extends UploadProgress {
  uploadFile: (bucket: string, file: File, folder?: string) => Promise<string | null>;
  resetProgress: () => void;
}

export function useStorageUpload(): UseStorageUploadReturn {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetProgress = () => {
    setProgress(0);
    setIsUploading(false);
    setError(null);
  };

  const uploadFile = async (bucket: string, file: File, folder?: string): Promise<string | null> => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = folder 
        ? `${folder}/${timestamp}_${sanitizedName}`
        : `${timestamp}_${sanitizedName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(100);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload gagal';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    progress,
    isUploading,
    error,
    uploadFile,
    resetProgress,
  };
}
