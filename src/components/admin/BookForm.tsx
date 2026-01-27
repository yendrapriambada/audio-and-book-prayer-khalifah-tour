import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Book } from '@/data/books';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface BookFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  onSubmit: (data: { title: string; description: string; pdfUrl: string; pageCount?: number }) => void;
}

const MAX_BOOK_SIZE = 150 * 1024 * 1024; // 150MB

export function BookForm({ open, onOpenChange, book, onSubmit }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pageCount, setPageCount] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { progress, isUploading, error: uploadError, uploadFile, resetProgress } = useStorageUpload();

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setDescription(book.description);
      setPdfUrl(book.pdfUrl);
      setPageCount(book.pageCount?.toString() || '');
    } else {
      setTitle('');
      setDescription('');
      setPdfUrl('');
      setPageCount('');
    }
    setSelectedFile(null);
    setValidationError(null);
    resetProgress();
  }, [book, open]);

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      setValidationError('Hanya file PDF yang diizinkan');
      return false;
    }
    if (file.size > MAX_BOOK_SIZE) {
      setValidationError('Ukuran file maksimal 150MB');
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
      setValidationError('Judul buku harus diisi');
      return;
    }

    let bookUrl = pdfUrl.trim();

    // If a file is selected, upload it first
    if (selectedFile) {
      const uploadedUrl = await uploadFile('books', selectedFile);
      if (!uploadedUrl) {
        return; // Upload failed, error is set by hook
      }
      bookUrl = uploadedUrl;
    }

    if (!bookUrl) {
      setValidationError('Pilih file PDF atau masukkan URL');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      pdfUrl: bookUrl,
      pageCount: pageCount ? parseInt(pageCount, 10) : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Buku' : 'Tambah Buku Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Buku</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul buku"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi buku"
              rows={3}
            />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>Upload File PDF</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="book-file"
            />
            
            {selectedFile ? (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
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
                Pilih File PDF
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
              Format: PDF. Maksimal 150MB
            </p>
          </div>

          {/* URL Alternative */}
          <div className="space-y-2">
            <Label htmlFor="pdfUrl">Atau URL PDF</Label>
            <Input
              id="pdfUrl"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://example.com/book.pdf"
              disabled={!!selectedFile}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pageCount">Jumlah Halaman (opsional)</Label>
            <Input
              id="pageCount"
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              placeholder="0"
              min="0"
            />
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
                book ? 'Simpan' : 'Tambah'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
