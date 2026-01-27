import { supabase } from '@/integrations/supabase/client';

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

export async function deleteStorageFile(bucket: string, fileUrl: string): Promise<boolean> {
  try {
    const filePath = extractFilePathFromUrl(bucket, fileUrl);
    if (!filePath) {
      // Not a storage URL (e.g., local /audio/... path), skip deletion
      return true;
    }

    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (deleteError) {
      console.error('Failed to delete file from storage:', deleteError);
      return false;
    }

    console.log(`Deleted file from ${bucket}: ${filePath}`);
    return true;
  } catch (err) {
    console.error('Error deleting file:', err);
    return false;
  }
}
