import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Loader2, BookOpen } from "lucide-react";
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
  // When audio is complete (or very close), show full circle
  const isComplete = duration > 0 && currentTime >= duration - 0.5;
  const progress = isComplete ? 100 : (duration > 0 ? (currentTime / duration) * 100 : 0);

  return (
    <div className="page-container flex flex-col min-h-screen pb-8">
      {/* Header */}
      <BackButton to={`/audio/${currentTrack.playlistId}`} />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Calm, Spiritual Album Art */}
        <div className="relative w-56 h-56 mb-10">
          {/* Soft outer glow */}
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
          
          {/* Progress ring - using fixed pixel values for accurate calculation */}
          {/* Container is 224px (w-56), radius is 48% = ~107px, circumference = 2 * π * 107 ≈ 672 */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 224 224">
            <circle
              cx="112"
              cy="112"
              r="107"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
            />
            <circle
              cx="112"
              cy="112"
              r="107"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="672"
              strokeDashoffset={672 - (progress / 100) * 672}
              className="transition-all duration-300"
            />
          </svg>

          {/* Main circle container */}
          <div className="absolute inset-3 bg-gradient-to-b from-primary/15 to-primary/5 rounded-full flex items-center justify-center shadow-sm">
            {/* Center icon */}
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-md">
              {isLoading ? (
                <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
              ) : (
                <BookOpen className="w-10 h-10 text-primary-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold text-foreground mb-2 line-clamp-2 px-4">
            {currentTrack.title}
          </h1>
          <p className="text-base text-muted-foreground">
            {isLoading ? "Memuat audio..." : currentTrack.playlistTitle}
          </p>
          {playlist.length > 1 && (
            <p className="text-sm text-muted-foreground mt-2">
              {currentIndex + 1} dari {playlist.length}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-sm mb-8">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value) => seek(value[0])}
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex justify-between text-sm mt-3">
            <span className="text-foreground font-medium">{formatTime(currentTime)}</span>
            <span className="text-muted-foreground">-{formatTime(remainingTime)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={previous}
            disabled={!hasPrevious || isLoading}
            aria-label="Sebelumnya"
            className="h-12 w-12 rounded-full text-foreground disabled:opacity-30"
          >
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            variant="default"
            size="icon"
            onClick={isPlaying ? pause : resume}
            disabled={isLoading}
            className="w-16 h-16 rounded-full shadow-md"
            aria-label={isLoading ? "Memuat" : isPlaying ? "Jeda" : "Putar"}
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            )}
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            disabled={!hasNext || isLoading}
            aria-label="Selanjutnya"
            className="h-12 w-12 rounded-full text-foreground disabled:opacity-30"
          >
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  );
}
