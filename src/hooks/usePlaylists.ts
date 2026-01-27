import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Track {
  id: string;
  playlist_id: string;
  title: string;
  src: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  tracks?: Track[];
}

export function usePlaylists(includeInactive = false) {
  return useQuery({
    queryKey: ['playlists', includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('playlists')
        .select('*, tracks(*)')
        .order('sort_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Sort tracks by sort_order
      return (data as Playlist[]).map(playlist => ({
        ...playlist,
        tracks: playlist.tracks?.sort((a, b) => a.sort_order - b.sort_order) || []
      }));
    },
  });
}

export function usePlaylist(id: string) {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*, tracks(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        tracks: data.tracks?.sort((a: Track, b: Track) => a.sort_order - b.sort_order) || []
      } as Playlist;
    },
    enabled: !!id,
  });
}

export function usePlaylistMutations() {
  const queryClient = useQueryClient();

  const addPlaylist = useMutation({
    mutationFn: async (playlist: { title: string; description?: string; is_active?: boolean }) => {
      const { data: maxOrder } = await supabase
        .from('playlists')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data, error } = await supabase
        .from('playlists')
        .insert({
          title: playlist.title,
          description: playlist.description || null,
          is_active: playlist.is_active ?? true,
          sort_order: (maxOrder?.sort_order || 0) + 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const updatePlaylist = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; title?: string; description?: string; is_active?: boolean }) => {
      const { data, error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const deletePlaylist = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const togglePlaylistStatus = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('playlists')
        .update({ is_active: !is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  return { addPlaylist, updatePlaylist, deletePlaylist, togglePlaylistStatus };
}

export function useTrackMutations() {
  const queryClient = useQueryClient();

  const addTrack = useMutation({
    mutationFn: async ({ playlistId, title, src }: { playlistId: string; title: string; src: string }) => {
      const { data: maxOrder } = await supabase
        .from('tracks')
        .select('sort_order')
        .eq('playlist_id', playlistId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data, error } = await supabase
        .from('tracks')
        .insert({
          playlist_id: playlistId,
          title,
          src,
          sort_order: (maxOrder?.sort_order || 0) + 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const updateTrack = useMutation({
    mutationFn: async ({ id, title, src }: { id: string; title?: string; src?: string }) => {
      const { data, error } = await supabase
        .from('tracks')
        .update({ title, src })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const deleteTrack = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  return { addTrack, updateTrack, deleteTrack };
}
