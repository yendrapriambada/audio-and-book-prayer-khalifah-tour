import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

interface AudioTrack {
  id: string;
  title: string;
  src: string;
  playlistId: string;
  playlistTitle: string;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playlist: AudioTrack[];
  currentIndex: number;
  play: (track: AudioTrack) => void;
  playPlaylist: (tracks: AudioTrack[], startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const playTrack = useCallback((track: AudioTrack, newPlaylist?: AudioTrack[], index?: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.src);
    audioRef.current = audio;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.play().then(() => {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (newPlaylist) {
        setPlaylist(newPlaylist);
        setCurrentIndex(index ?? 0);
      }
    }).catch((error) => {
      console.error("Error playing audio:", error);
    });

    audio.onended = () => {
      // Auto-play next track if available
      if (newPlaylist || playlist.length > 0) {
        const list = newPlaylist || playlist;
        const nextIdx = (index ?? currentIndex) + 1;
        if (nextIdx < list.length) {
          playTrack(list[nextIdx], list, nextIdx);
        } else {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    };
  }, [playlist, currentIndex]);

  const play = useCallback((track: AudioTrack) => {
    playTrack(track, [track], 0);
  }, [playTrack]);

  const playPlaylist = useCallback((tracks: AudioTrack[], startIndex = 0) => {
    if (tracks.length > 0) {
      playTrack(tracks[startIndex], tracks, startIndex);
    }
  }, [playTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlaylist([]);
    setCurrentIndex(-1);
  }, []);

  const next = useCallback(() => {
    if (playlist.length > 0 && currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      playTrack(playlist[nextIndex], playlist, nextIndex);
    }
  }, [playlist, currentIndex, playTrack]);

  const previous = useCallback(() => {
    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    if (playlist.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      playTrack(playlist[prevIndex], playlist, prevIndex);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [playlist, currentIndex, playTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return (
    <AudioContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      currentTime,
      duration,
      playlist,
      currentIndex,
      play, 
      playPlaylist,
      pause, 
      resume, 
      stop,
      next,
      previous,
      seek
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}
