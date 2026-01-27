import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

interface UseStorageUploadReturn extends UploadProgress {
  uploadFile: (bucket: string, file: File, folder?: string) => Promise<string | null>;
  deleteFile: (bucket: string, fileUrl: string) => Promise<boolean>;
  resetProgress: () => void;
}

// Helper to extract file path from Supabase Storage URL
function extractFilePathFromUrl(bucket: string, fileUrl: string): string | null {
  try {
    const url = new URL(fileUrl);
    // URL format: .../storage/v1/object/public/{bucket}/{path}
    const match = url.pathname.match(new RegExp(`/storage/v1/object/public/${bucket}/(.+)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
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

  const deleteFile = async (bucket: string, fileUrl: string): Promise<boolean> => {
    try {
      const filePath = extractFilePathFromUrl(bucket, fileUrl);
      if (!filePath) {
        // Not a storage URL, skip deletion
        return true;
      }

      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (deleteError) {
        console.error('Failed to delete file:', deleteError);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error deleting file:', err);
      return false;
    }
  };

  return {
    progress,
    isUploading,
    error,
    uploadFile,
    deleteFile,
    resetProgress,
  };
}
