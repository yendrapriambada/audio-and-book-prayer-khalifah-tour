import { Pause, Play, X } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { Link } from "react-router-dom";

export function MiniPlayer() {
  const { currentTrack, isPlaying, pause, resume, stop } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 shadow-2xl z-50">
      <div className="flex items-center gap-4">
        <Link to="/audio/player" className="flex-1 min-w-0">
          <p className="font-semibold text-lg truncate">{currentTrack.title}</p>
          <p className="text-sm opacity-80">
            {isPlaying ? "Sedang Diputar" : "Dijeda"}
          </p>
        </Link>
        
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? pause : resume}
            className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center transition-all active:scale-95"
            aria-label={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            )}
          </button>
          
          <button
            onClick={stop}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-all active:scale-95"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
