import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AudioTrack } from '@/data/playlists';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { Upload, Music, X, Loader2 } from 'lucide-react';

interface TrackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track?: AudioTrack | null;
  onSubmit: (data: { title: string; src: string; oldSrc?: string }) => void;
}

const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];

export function TrackForm({ open, onOpenChange, track, onSubmit }: TrackFormProps) {
  const [title, setTitle] = useState('');
  const [src, setSrc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { progress, isUploading, error: uploadError, uploadFile, resetProgress } = useStorageUpload();

  useEffect(() => {
    if (track) {
      setTitle(track.title);
      setSrc(track.src);
    } else {
      setTitle('');
      setSrc('');
    }
    setSelectedFile(null);
    setValidationError(null);
    resetProgress();
  }, [track, open]);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      setValidationError('Hanya file MP3, WAV, atau OGG yang diizinkan');
      return false;
    }
    if (file.size > MAX_AUDIO_SIZE) {
      setValidationError('Ukuran file maksimal 50MB');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      // Auto-fill title from filename if empty
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt.replace(/_/g, ' '));
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setValidationError('Judul audio harus diisi');
      return;
    }

    let audioUrl = src.trim();
    const oldSrc = track?.src;

    // If a file is selected, upload it first
    if (selectedFile) {
      const uploadedUrl = await uploadFile('audio', selectedFile);
      if (!uploadedUrl) {
        return; // Upload failed, error is set by hook
      }
      audioUrl = uploadedUrl;
    }

    if (!audioUrl) {
      setValidationError('Pilih file audio atau masukkan URL');
      return;
    }

    // Pass oldSrc if file changed so parent can delete old file
    const fileChanged = selectedFile && oldSrc && oldSrc !== audioUrl;
    onSubmit({ 
      title: title.trim(), 
      src: audioUrl,
      oldSrc: fileChanged ? oldSrc : undefined
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{track ? 'Edit Audio' : 'Tambah Audio Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Audio</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul audio"
              required
            />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>Upload File Audio</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
              onChange={handleFileChange}
              className="hidden"
              id="audio-file"
            />
            
            {selectedFile ? (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Music className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Pilih File Audio
              </Button>
            )}
            
            {isUploading && (
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Mengupload... {progress}%
                </p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Format: MP3, WAV, OGG. Maksimal 50MB
            </p>
          </div>

          {/* URL Alternative */}
          <div className="space-y-2">
            <Label htmlFor="src">Atau URL Audio</Label>
            <Input
              id="src"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="/audio/nama-file.mp3 atau URL"
              disabled={!!selectedFile}
            />
            <p className="text-xs text-muted-foreground">
              Gunakan jika tidak mengupload file
            </p>
          </div>

          {/* Error Messages */}
          {(validationError || uploadError) && (
            <p className="text-sm text-destructive">
              {validationError || uploadError}
            </p>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mengupload...
                </>
              ) : (
                track ? 'Simpan' : 'Tambah'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
