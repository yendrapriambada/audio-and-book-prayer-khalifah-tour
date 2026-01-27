import React, { createContext, useContext } from 'react';
import { usePlaylists, usePlaylist, usePlaylistMutations, useTrackMutations, Playlist, Track } from '@/hooks/usePlaylists';
import { useBooks, useBook, useBookMutations, Book } from '@/hooks/useBooks';

interface DataContextType {
  // Playlists
  playlists: Playlist[];
  isLoadingPlaylists: boolean;
  addPlaylist: (playlist: { title: string; description?: string; is_active?: boolean }) => Promise<void>;
  updatePlaylist: (id: string, updates: { title?: string; description?: string; is_active?: boolean }) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  togglePlaylistStatus: (id: string, is_active: boolean) => Promise<void>;
  getPlaylist: (id: string) => Playlist | undefined;
  
  // Tracks
  addTrack: (playlistId: string, track: { title: string; src: string }) => Promise<void>;
  updateTrack: (trackId: string, updates: { title?: string; src?: string }) => Promise<void>;
  deleteTrack: (trackId: string) => Promise<void>;
  
  // Books
  books: Book[];
  isLoadingBooks: boolean;
  addBook: (book: { title: string; description?: string; pdf_url: string }) => Promise<void>;
  updateBook: (id: string, updates: { title?: string; description?: string; pdf_url?: string }) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBook: (id: string) => Book | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Use admin mode to see all playlists including inactive
  const { data: playlists = [], isLoading: isLoadingPlaylists } = usePlaylists(true);
  const { data: books = [], isLoading: isLoadingBooks } = useBooks();
  
  const playlistMutations = usePlaylistMutations();
  const trackMutations = useTrackMutations();
  const bookMutations = useBookMutations();

  // Playlist operations
  const addPlaylist = async (playlist: { title: string; description?: string; is_active?: boolean }) => {
    await playlistMutations.addPlaylist.mutateAsync(playlist);
  };

  const updatePlaylist = async (id: string, updates: { title?: string; description?: string; is_active?: boolean }) => {
    await playlistMutations.updatePlaylist.mutateAsync({ id, ...updates });
  };

  const deletePlaylist = async (id: string) => {
    await playlistMutations.deletePlaylist.mutateAsync(id);
  };

  const togglePlaylistStatus = async (id: string, is_active: boolean) => {
    await playlistMutations.togglePlaylistStatus.mutateAsync({ id, is_active });
  };

  const getPlaylist = (id: string) => {
    return playlists.find((p) => p.id === id);
  };

  // Track operations
  const addTrack = async (playlistId: string, track: { title: string; src: string }) => {
    await trackMutations.addTrack.mutateAsync({ playlistId, ...track });
  };

  const updateTrack = async (trackId: string, updates: { title?: string; src?: string }) => {
    await trackMutations.updateTrack.mutateAsync({ id: trackId, ...updates });
  };

  const deleteTrack = async (trackId: string) => {
    await trackMutations.deleteTrack.mutateAsync(trackId);
  };

  // Book operations
  const addBook = async (book: { title: string; description?: string; pdf_url: string }) => {
    await bookMutations.addBook.mutateAsync(book);
  };

  const updateBook = async (id: string, updates: { title?: string; description?: string; pdf_url?: string }) => {
    await bookMutations.updateBook.mutateAsync({ id, ...updates });
  };

  const deleteBook = async (id: string) => {
    await bookMutations.deleteBook.mutateAsync(id);
  };

  const getBook = (id: string) => {
    return books.find((b) => b.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        playlists,
        isLoadingPlaylists,
        addPlaylist,
        updatePlaylist,
        deletePlaylist,
        togglePlaylistStatus,
        getPlaylist,
        addTrack,
        updateTrack,
        deleteTrack,
        books,
        isLoadingBooks,
        addBook,
        updateBook,
        deleteBook,
        getBook,
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

// Re-export types for convenience
export type { Playlist, Track, Book };
