import React, { createContext, useContext, useState, useRef, useCallback } from "react";

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
  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((track: AudioTrack) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.src);
    audioRef.current = audio;
    
    audio.play().then(() => {
      setCurrentTrack(track);
      setIsPlaying(true);
    }).catch((error) => {
      console.error("Error playing audio:", error);
    });

    audio.onended = () => {
      setIsPlaying(false);
    };
  }, []);

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
  }, []);

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, play, pause, resume, stop }}>
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
