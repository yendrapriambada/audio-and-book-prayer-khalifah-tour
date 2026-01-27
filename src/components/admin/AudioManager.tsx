import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Music, ChevronDown, ChevronRight } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { PlaylistForm } from './PlaylistForm';
import { TrackForm } from './TrackForm';
import { Playlist, AudioTrack } from '@/data/playlists';
import { deleteStorageFile } from '@/lib/storageUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function AudioManager() {
  const { playlists, addPlaylist, updatePlaylist, deletePlaylist, togglePlaylistStatus, addTrack, updateTrack, deleteTrack } = useData();
  
  const [playlistFormOpen, setPlaylistFormOpen] = useState(false);
  const [trackFormOpen, setTrackFormOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [editingTrack, setEditingTrack] = useState<{ playlistId: string; track: AudioTrack } | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'playlist' | 'track'; id: string; playlistId?: string } | null>(null);
  const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedPlaylists((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddPlaylist = () => {
    setEditingPlaylist(null);
    setPlaylistFormOpen(true);
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setPlaylistFormOpen(true);
  };

  const handlePlaylistSubmit = (data: { title: string; description: string; isActive: boolean }) => {
    if (editingPlaylist) {
      updatePlaylist(editingPlaylist.id, data);
    } else {
      addPlaylist({ ...data, tracks: [], isActive: data.isActive });
    }
  };

  const handleAddTrack = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setEditingTrack(null);
    setTrackFormOpen(true);
  };

  const handleEditTrack = (playlistId: string, track: AudioTrack) => {
    setSelectedPlaylistId(playlistId);
    setEditingTrack({ playlistId, track });
    setTrackFormOpen(true);
  };

  const handleTrackSubmit = async (data: { title: string; src: string; oldSrc?: string }) => {
    // Delete old file from storage if replaced
    if (data.oldSrc) {
      await deleteStorageFile('audio', data.oldSrc);
    }
    
    if (editingTrack) {
      updateTrack(editingTrack.playlistId, editingTrack.track.id, { title: data.title, src: data.src });
    } else if (selectedPlaylistId) {
      addTrack(selectedPlaylistId, { title: data.title, src: data.src });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'playlist') {
      // Delete all audio files in the playlist from storage
      const playlist = playlists.find(p => p.id === deleteConfirm.id);
      if (playlist) {
        for (const track of playlist.tracks) {
          await deleteStorageFile('audio', track.src);
        }
      }
      deletePlaylist(deleteConfirm.id);
    } else if (deleteConfirm.playlistId) {
      // Delete single track's audio file from storage
      const playlist = playlists.find(p => p.id === deleteConfirm.playlistId);
      const track = playlist?.tracks.find(t => t.id === deleteConfirm.id);
      if (track) {
        await deleteStorageFile('audio', track.src);
      }
      deleteTrack(deleteConfirm.playlistId, deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Kelola Audio</h2>
        <Button onClick={handleAddPlaylist} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Playlist Baru
        </Button>
      </div>

      <div className="space-y-3">
        {playlists.map((playlist) => {
          const isActive = playlist.isActive ?? true;
          return (
            <Card key={playlist.id} className={`overflow-hidden ${!isActive ? 'opacity-60' : ''}`}>
            <Collapsible
              open={expandedPlaylists.has(playlist.id)}
              onOpenChange={() => toggleExpanded(playlist.id)}
            >
              <CardHeader className="p-3">
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center gap-2 text-left flex-1">
                      {expandedPlaylists.has(playlist.id) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="flex items-center gap-2">
                        <div>
                          <CardTitle className="text-base">{playlist.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {playlist.tracks.length} audio
                          </p>
                        </div>
                        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                          {isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => togglePlaylistStatus(playlist.id)}
                      aria-label="Toggle status"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditPlaylist(playlist)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteConfirm({ type: 'playlist', id: playlist.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CollapsibleContent>
                <CardContent className="p-3 pt-0 space-y-2">
                  {playlist.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-primary" />
                        <span className="text-sm">{track.title}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditTrack(playlist.id, track)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() =>
                            setDeleteConfirm({ type: 'track', id: track.id, playlistId: playlist.id })
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleAddTrack(playlist.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Audio
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
            </Card>
          );
        })}

        {playlists.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Belum ada playlist</p>
          </div>
        )}
      </div>

      <PlaylistForm
        open={playlistFormOpen}
        onOpenChange={setPlaylistFormOpen}
        playlist={editingPlaylist}
        onSubmit={handlePlaylistSubmit}
      />

      <TrackForm
        open={trackFormOpen}
        onOpenChange={setTrackFormOpen}
        track={editingTrack?.track}
        onSubmit={handleTrackSubmit}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.type === 'playlist'
                ? 'Apakah Anda yakin ingin menghapus playlist ini? Semua audio di dalamnya akan ikut terhapus.'
                : 'Apakah Anda yakin ingin menghapus audio ini?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
