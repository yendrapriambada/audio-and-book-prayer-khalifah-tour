import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Playlist, AudioTrack, playlists as defaultPlaylists } from '@/data/playlists';
import { Book, books as defaultBooks } from '@/data/books';

interface DataContextType {
  // Playlists
  playlists: Playlist[];
  addPlaylist: (playlist: Omit<Playlist, 'id'>) => void;
  updatePlaylist: (id: string, playlist: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  togglePlaylistStatus: (id: string) => void;
  getPlaylist: (id: string) => Playlist | undefined;
  
  // Tracks
  addTrack: (playlistId: string, track: Omit<AudioTrack, 'id'>) => void;
  updateTrack: (playlistId: string, trackId: string, track: Partial<AudioTrack>) => void;
  deleteTrack: (playlistId: string, trackId: string) => void;
  
  // Books
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  getBook: (id: string) => Book | undefined;
  
  // Reset
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>('khalifah-playlists', defaultPlaylists);
  const [books, setBooks] = useLocalStorage<Book[]>('khalifah-books', defaultBooks);

  // Playlist operations
  const addPlaylist = (playlist: Omit<Playlist, 'id'>) => {
    const id = `playlist-${Date.now()}`;
    setPlaylists((prev) => [...prev, { ...playlist, id, isActive: playlist.isActive ?? true }]);
  };

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePlaylistStatus = (id: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !(p.isActive ?? true) } : p))
    );
  };

  const getPlaylist = (id: string) => {
    return playlists.find((p) => p.id === id);
  };

  // Track operations
  const addTrack = (playlistId: string, track: Omit<AudioTrack, 'id'>) => {
    const trackId = `track-${Date.now()}`;
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, tracks: [...p.tracks, { ...track, id: trackId }] }
          : p
      )
    );
  };

  const updateTrack = (playlistId: string, trackId: string, updates: Partial<AudioTrack>) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              tracks: p.tracks.map((t) =>
                t.id === trackId ? { ...t, ...updates } : t
              ),
            }
          : p
      )
    );
  };

  const deleteTrack = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
          : p
      )
    );
  };

  // Book operations
  const addBook = (book: Omit<Book, 'id'>) => {
    const id = `book-${Date.now()}`;
    setBooks((prev) => [...prev, { ...book, id }]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const getBook = (id: string) => {
    return books.find((b) => b.id === id);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setPlaylists(defaultPlaylists);
    setBooks(defaultBooks);
  };

  return (
    <DataContext.Provider
      value={{
        playlists,
        addPlaylist,
        updatePlaylist,
        deletePlaylist,
        togglePlaylistStatus,
        getPlaylist,
        addTrack,
        updateTrack,
        deleteTrack,
        books,
        addBook,
        updateBook,
        deleteBook,
        getBook,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
