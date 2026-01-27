import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AudioTrack } from '@/data/playlists';

interface TrackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track?: AudioTrack | null;
  onSubmit: (data: { title: string; src: string }) => void;
}

export function TrackForm({ open, onOpenChange, track, onSubmit }: TrackFormProps) {
  const [title, setTitle] = useState('');
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (track) {
      setTitle(track.title);
      setSrc(track.src);
    } else {
      setTitle('');
      setSrc('');
    }
  }, [track, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && src.trim()) {
      onSubmit({ title: title.trim(), src: src.trim() });
      onOpenChange(false);
    }
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
          <div className="space-y-2">
            <Label htmlFor="src">URL Audio</Label>
            <Input
              id="src"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="/audio/nama-file.mp3 atau URL"
              required
            />
            <p className="text-xs text-muted-foreground">
              Gunakan path lokal (/audio/file.mp3) atau URL lengkap
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{track ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
