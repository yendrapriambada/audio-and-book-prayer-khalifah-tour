import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Music, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useData, Playlist, Track } from '@/context/DataContext';
import { PlaylistForm } from './PlaylistForm';
import { TrackForm } from './TrackForm';
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
  const { 
    playlists, 
    isLoadingPlaylists,
    addPlaylist, 
    updatePlaylist, 
    deletePlaylist, 
    togglePlaylistStatus, 
    addTrack, 
    updateTrack, 
    deleteTrack 
  } = useData();
  
  const [playlistFormOpen, setPlaylistFormOpen] = useState(false);
  const [trackFormOpen, setTrackFormOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [editingTrack, setEditingTrack] = useState<{ playlistId: string; track: Track } | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'playlist' | 'track'; id: string; playlistId?: string } | null>(null);
  const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handlePlaylistSubmit = async (data: { title: string; description: string; is_active: boolean }) => {
    if (editingPlaylist) {
      await updatePlaylist(editingPlaylist.id, data);
    } else {
      await addPlaylist({ ...data });
    }
  };

  const handleAddTrack = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setEditingTrack(null);
    setTrackFormOpen(true);
  };

  const handleEditTrack = (playlistId: string, track: Track) => {
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
      await updateTrack(editingTrack.track.id, { title: data.title, src: data.src });
    } else if (selectedPlaylistId) {
      await addTrack(selectedPlaylistId, { title: data.title, src: data.src });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    
    setIsDeleting(true);
    try {
      if (deleteConfirm.type === 'playlist') {
        // Delete all audio files in the playlist from storage
        const playlist = playlists.find(p => p.id === deleteConfirm.id);
        if (playlist && playlist.tracks) {
          for (const track of playlist.tracks) {
            await deleteStorageFile('audio', track.src);
          }
        }
        await deletePlaylist(deleteConfirm.id);
      } else if (deleteConfirm.playlistId) {
        // Delete single track's audio file from storage
        const playlist = playlists.find(p => p.id === deleteConfirm.playlistId);
        const track = playlist?.tracks?.find(t => t.id === deleteConfirm.id);
        if (track) {
          await deleteStorageFile('audio', track.src);
        }
        await deleteTrack(deleteConfirm.id);
      }
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  if (isLoadingPlaylists) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          const isActive = playlist.is_active;
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
                            {playlist.tracks?.length || 0} audio
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
                      onCheckedChange={() => togglePlaylistStatus(playlist.id, isActive)}
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
                  {playlist.tracks?.map((track) => (
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
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
