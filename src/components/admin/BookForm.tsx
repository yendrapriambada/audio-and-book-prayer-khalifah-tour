import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Book } from '@/data/books';

interface BookFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  onSubmit: (data: { title: string; description: string; pdfUrl: string; pageCount?: number }) => void;
}

export function BookForm({ open, onOpenChange, book, onSubmit }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pageCount, setPageCount] = useState<string>('');

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
  }, [book, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && pdfUrl.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        pdfUrl: pdfUrl.trim(),
        pageCount: pageCount ? parseInt(pageCount, 10) : undefined,
      });
      onOpenChange(false);
    }
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
          <div className="space-y-2">
            <Label htmlFor="pdfUrl">URL PDF</Label>
            <Input
              id="pdfUrl"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://example.com/book.pdf"
              required
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{book ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
