import { Pause, Play, X } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { Link } from "react-router-dom";

export function MiniPlayer() {
  const { currentTrack, isPlaying, pause, resume, stop } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-foreground text-background px-4 py-3 shadow-lg z-50">
      <div className="flex items-center gap-3">
        <Link to="/audio/player" className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{currentTrack.title}</p>
          <p className="text-xs opacity-70">
            {isPlaying ? "Sedang Diputar" : "Dijeda"}
          </p>
        </Link>
        
        <div className="flex items-center gap-1">
          <button
            onClick={isPlaying ? pause : resume}
            className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center transition-all active:scale-95"
            aria-label={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>
          
          <button
            onClick={stop}
            className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center transition-all active:scale-95"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
