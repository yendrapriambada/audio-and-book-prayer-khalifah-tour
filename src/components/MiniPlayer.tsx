import { Pause, Play, SkipBack, SkipForward, X, Loader2 } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export function MiniPlayer() {
  const { 
    currentTrack, 
    isPlaying,
    isLoading,
    currentTime,
    duration,
    playlist,
    currentIndex,
    pause, 
    resume, 
    stop,
    next,
    previous
  } = useAudio();

  if (!currentTrack) return null;

  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-xl z-50">
      {/* Progress bar */}
      <Progress value={progress} className="h-1 rounded-none bg-primary-foreground/20" />
      
      <div className="flex items-center gap-2 p-3">
        <Link to="/audio/player" className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{currentTrack.title}</p>
          <p className="text-xs opacity-80 truncate">
            {isLoading ? "Memuat..." : currentTrack.playlistTitle}
            {!isLoading && playlist.length > 1 && ` • ${currentIndex + 1}/${playlist.length}`}
          </p>
        </Link>
        
        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            onClick={previous}
            disabled={!hasPrevious || isLoading}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
            aria-label="Sebelumnya"
          >
            <SkipBack className="w-4 h-4" fill="currentColor" />
          </button>
          
          {/* Play/Pause/Loading */}
          <button
            onClick={isPlaying ? pause : resume}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-all active:scale-95 disabled:opacity-70"
            aria-label={isLoading ? "Memuat" : isPlaying ? "Jeda" : "Putar"}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            )}
          </button>
          
          {/* Next */}
          <button
            onClick={next}
            disabled={!hasNext || isLoading}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
            aria-label="Selanjutnya"
          >
            <SkipForward className="w-4 h-4" fill="currentColor" />
          </button>
          
          {/* Close */}
          <button
            onClick={stop}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all active:scale-95 ml-1"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
