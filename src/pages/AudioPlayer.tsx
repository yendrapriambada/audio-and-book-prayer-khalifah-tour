import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Loader2, Download } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useAudio } from "@/context/AudioContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
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
    next,
    previous,
    seek
  } = useAudio();

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!currentTrack?.src) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(currentTrack.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentTrack.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!currentTrack) {
    return (
      <div className="page-container">
        <BackButton to="/audio" />
        <div className="flex-1 flex items-center justify-center mt-20">
          <p className="text-xl text-muted-foreground text-center">
            Tidak ada audio yang dipilih.
            <br />
            Silakan pilih audio dari playlist.
          </p>
        </div>
      </div>
    );
  }

  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0 || currentTime > 3;
  const remainingTime = duration - currentTime;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="page-container flex flex-col min-h-screen pb-8">
      {/* Header with back and download buttons */}
      <div className="flex items-center justify-between">
        <BackButton to={`/audio/${currentTrack.playlistId}`} />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          disabled={isDownloading}
          className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80"
          aria-label="Download audio"
        >
          {isDownloading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Enhanced Album Art with Animated Rings */}
        <div className="relative w-72 h-72 mb-10">
          {/* Outer animated ring */}
          <div 
            className={cn(
              "absolute inset-0 rounded-full border-4 border-primary/20 transition-all duration-500",
              isPlaying && "animate-[spin_8s_linear_infinite]"
            )}
            style={{
              background: `conic-gradient(from 0deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))`
            }}
          />
          
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.89} 289`}
              className="transition-all duration-300"
            />
          </svg>

          {/* Inner container */}
          <div className="absolute inset-4 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full shadow-2xl flex items-center justify-center">
            {/* Center circle with visualizer */}
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              {isLoading ? (
                <Loader2 className="w-14 h-14 text-primary-foreground animate-spin" />
              ) : isPlaying ? (
                <div className="flex items-end gap-1.5 h-16">
                  <div 
                    className="w-2.5 bg-primary-foreground rounded-full animate-bounce" 
                    style={{ height: '60%', animationDelay: '0ms', animationDuration: '0.6s' }} 
                  />
                  <div 
                    className="w-2.5 bg-primary-foreground rounded-full animate-bounce" 
                    style={{ height: '100%', animationDelay: '150ms', animationDuration: '0.6s' }} 
                  />
                  <div 
                    className="w-2.5 bg-primary-foreground rounded-full animate-bounce" 
                    style={{ height: '40%', animationDelay: '300ms', animationDuration: '0.6s' }} 
                  />
                  <div 
                    className="w-2.5 bg-primary-foreground rounded-full animate-bounce" 
                    style={{ height: '80%', animationDelay: '450ms', animationDuration: '0.6s' }} 
                  />
                  <div 
                    className="w-2.5 bg-primary-foreground rounded-full animate-bounce" 
                    style={{ height: '50%', animationDelay: '600ms', animationDuration: '0.6s' }} 
                  />
                </div>
              ) : (
                <Play className="w-14 h-14 text-primary-foreground ml-2" fill="currentColor" />
              )}
            </div>
          </div>
          
          {/* Pulsing background effect when playing */}
          {isPlaying && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-8 rounded-full bg-primary/5 animate-ping" style={{ animationDuration: '2.5s' }} />
            </>
          )}
        </div>

        {/* Track Info with better styling */}
        <div className="mb-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-foreground mb-2 truncate px-4">
            {currentTrack.title}
          </h1>
          <p className="text-base text-muted-foreground font-medium">
            {isLoading ? "Memuat audio..." : currentTrack.playlistTitle}
          </p>
          {playlist.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {playlist.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    idx === currentIndex 
                      ? "w-6 bg-primary" 
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-full max-w-sm mb-8">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value) => seek(value[0])}
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex justify-between text-sm font-medium mt-3">
            <span className="text-foreground">{formatTime(currentTime)}</span>
            <span className="text-muted-foreground">-{formatTime(remainingTime)}</span>
          </div>
        </div>

        {/* Enhanced Playback Controls */}
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={previous}
            disabled={!hasPrevious || isLoading}
            aria-label="Sebelumnya"
            className="h-14 w-14 rounded-full text-foreground disabled:opacity-30 hover:bg-muted transition-all duration-200 hover:scale-105"
          >
            <SkipBack className="w-7 h-7" fill="currentColor" />
          </Button>

          {/* Play/Pause Button with enhanced styling */}
          <Button
            variant="default"
            size="icon"
            onClick={isPlaying ? pause : resume}
            disabled={isLoading}
            className="w-18 h-18 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            style={{ width: '72px', height: '72px' }}
            aria-label={isLoading ? "Memuat" : isPlaying ? "Jeda" : "Putar"}
          >
            {isLoading ? (
              <Loader2 className="w-9 h-9 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-9 h-9" fill="currentColor" />
            ) : (
              <Play className="w-9 h-9 ml-1" fill="currentColor" />
            )}
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            disabled={!hasNext || isLoading}
            aria-label="Selanjutnya"
            className="h-14 w-14 rounded-full text-foreground disabled:opacity-30 hover:bg-muted transition-all duration-200 hover:scale-105"
          >
            <SkipForward className="w-7 h-7" fill="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  );
}
