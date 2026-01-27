import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Playlist } from '@/context/DataContext';

interface PlaylistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist?: Playlist | null;
  onSubmit: (data: { title: string; description: string; is_active: boolean }) => void;
}

export function PlaylistForm({ open, onOpenChange, playlist, onSubmit }: PlaylistFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
      setDescription(playlist.description || '');
      setIsActive(playlist.is_active);
    } else {
      setTitle('');
      setDescription('');
      setIsActive(true);
    }
  }, [playlist, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title: title.trim(), description: description.trim(), is_active: isActive });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{playlist ? 'Edit Playlist' : 'Tambah Playlist Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Playlist</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul playlist"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi playlist"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Status Aktif</Label>
              <p className="text-xs text-muted-foreground">
                Playlist aktif akan muncul di halaman user
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{playlist ? 'Simpan' : 'Tambah'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
